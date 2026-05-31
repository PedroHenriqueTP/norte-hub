
import NextAuth, { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: Role
            tenantId: string
        } & DefaultSession["user"]
    }

    interface User {
        role: Role
        tenantId: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: Role
        tenantId: string
    }
}
