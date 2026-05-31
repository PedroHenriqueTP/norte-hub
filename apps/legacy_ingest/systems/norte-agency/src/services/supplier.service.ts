import { prisma } from "@/lib/prisma";

export type CreateSupplierDTO = {
    name: string;
    email?: string;
    document?: string;
    phone?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export class SupplierService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new SupplierService(tenantId);
    }

    async getAll() {
        return await prisma.supplier.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(data: CreateSupplierDTO) {
        return await prisma.supplier.create({
            data: {
                ...data,
                tenantId: this.tenantId
            }
        });
    }

    async delete(id: string) {
        return await prisma.supplier.delete({
            where: { id, tenantId: this.tenantId }
        });
    }
}
