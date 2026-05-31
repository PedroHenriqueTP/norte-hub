import { prisma } from "@/lib/prisma";

export type CreateClientDTO = {
    name: string;
    email?: string;
    document?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
};

export class ClientService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new ClientService(tenantId);
    }

    async getAll() {
        return await prisma.client.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { jobs: true }
                }
            }
        });
    }

    async create(data: CreateClientDTO) {
        return await prisma.client.create({
            data: {
                ...data,
                tenantId: this.tenantId
            }
        });
    }

    async delete(id: string) {
        return await prisma.client.delete({
            where: { id, tenantId: this.tenantId }
        });
    }
}
