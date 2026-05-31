
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Role } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        GitHub,
        Facebook,
        Apple,
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findFirst({
                        where: { email },
                    });

                    if (!user || !user.password) return null;

                    const passwordsMatch = await compare(password, user.password);

                    if (passwordsMatch) return user;
                }

                console.log("Invalid credentials");
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account && account.provider !== "credentials" && user.email) {
                // Multi-Provider Logic: Se o usuário logar via SSO pela primeira vez, cadastra ele como Lead.
                console.log(`[SSO LOGIN] Conectando provedor ${account.provider} para ${user.email}`);
                
                // Em produção: Buscaria se o email já existe na tabela de User. Se não, cria um Tenant e User.
                // Mas a instrução diz para salvar como um Lead (Client) na tabela do banco para disparar o webhook.
                try {
                    const existingLead = await prisma.client.findFirst({
                        where: { email: user.email }
                    });

                    if (!existingLead) {
                        // Isso garante a inserção do lead globalmente (no tenant master)
                        // tenantId mockado aqui, idealmente busca do environment MASTER_TENANT_ID
                        await prisma.client.create({
                            data: {
                                name: user.name || "SSO User",
                                email: user.email,
                                tenantId: "system-auto", // tenant master
                                city: "Digital SSO (Norte Hub)"
                            }
                        });
                        console.log(`[COGITARE WEBHOOK] Disparando boas-vindas para: ${user.email}`);
                        // fetch("https://webhook.site/xxx", { method: "POST", body: JSON.stringify({ email: user.email }) });
                    }
                } catch (e) {
                    console.error("Erro no SSO Sync", e);
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user.role as Role | undefined) ?? Role.PRODUCER_SUPPORT;
                token.tenantId = String(user.tenantId ?? "");
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id ?? "");
                session.user.role = (token.role as Role | undefined) ?? Role.PRODUCER_SUPPORT;
                session.user.tenantId = String(token.tenantId ?? "");
            }
            return session;
        },
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                // Allows session sharing across subdomains (e.g., st-cafe.agencyos.com)
                domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined 
            }
        }
    }
})

export async function getAuthenticatedUserTenant() {
    const session = await auth();
    if (!session || !session.user || !session.user.tenantId) {
        throw new Error("Unauthorized");
    }
    return {
        tenantId: session.user.tenantId,
        user: session.user
    };
}

export async function getUserRole() {
    const session = await auth();
    if (!session || !session.user) return null;
    return session.user.role;
}

export async function getAuthenticatedUser() {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}

export async function getSovereignIdentity() {
    const session = await auth();
    if (!session?.user?.id || !session.user.tenantId) {
        throw new Error("Unauthorized");
    }
    return {
        userId: session.user.id,
        tenantId: session.user.tenantId,
        role: session.user.role,
    };
}

export async function getTenantId() {
    const session = await auth();
    if (!session || !session.user || !session.user.tenantId) {
        throw new Error("Unauthorized");
    }
    return session.user.tenantId;
}
