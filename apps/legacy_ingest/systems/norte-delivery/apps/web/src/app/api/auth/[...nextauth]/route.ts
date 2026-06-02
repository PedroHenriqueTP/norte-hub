import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          if (res.ok && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              tenantId: data.user.tenantId,
              accessToken: data.access_token
            };
          }
          throw new Error(data.message || 'Credenciais inválidas');
        } catch (error: any) {
          throw new Error(error.message || 'Erro de autenticação');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          // @ts-ignore
          id: (token.sub || "") as string,
          // @ts-ignore
          role: token.role,
          // @ts-ignore
          tenantId: token.tenantId
        };
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  session: {
    strategy: "jwt"
  }
});

export { handler as GET, handler as POST };
