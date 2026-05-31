"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
    const session = await auth();
    const user = session?.user;

    if (!user?.email) {
        return { error: "Unauthorized" };
    }
    const email = user.email as string;

    const agencyName = formData.get("agencyName") as string;
    const document = formData.get("document") as string; // CPF or CNPJ
    const name = (formData.get("name") as string) || user.name || user.email;

    if (!agencyName || !document) {
        return { error: "Nome da Agência e Documento são obrigatórios." };
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return { error: "Usuário já cadastrado." };
        }

        // 2. Generate Slug
        let slug = agencyName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        // Ensure slug uniqueness (simple check)
        const existingTenant = await prisma.tenant.findUnique({ where: { slug } });
        if (existingTenant) {
            slug = `${slug}-${Date.now()}`;
        }

        // 3. Create Tenant & User Transaction
        await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: agencyName,
                    slug: slug,
                    document: document // Save document at Tenant level (Agency CNPJ)
                }
            });

            await tx.user.create({
                data: {
                    email,
                    name: name,
                    role: "OWNER",
                    tenantId: tenant.id,
                    document: document // Save document at User level (Personal CPF) - simplification for now
                }
            });
        });

        revalidatePath("/");
        return { success: true };

    } catch (e) {
        console.error("Onboarding Error:", e);
        return { error: "Erro ao criar conta. Tente novamente." };
    }
}
