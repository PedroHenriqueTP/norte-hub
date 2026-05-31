import { auth } from "@/lib/auth";

export type AuthContext = {
    tenantId: string;
    userId: string;
    role: string;
}

export async function getAuthContext(): Promise<AuthContext> {
    const session = await auth();

    if (!session || !session.user || !session.user.tenantId || !session.user.id) {
        throw new Error("Unauthorized: No valid session or tenant context found.");
    }

    return {
        tenantId: session.user.tenantId,
        userId: session.user.id,
        role: session.user.role as string,
    };
}
