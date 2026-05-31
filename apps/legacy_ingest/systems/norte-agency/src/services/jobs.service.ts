import { prisma } from "@/lib/prisma";

export type CreateJobDTO = {
    title: string;
    description?: string;
    clientId: string;
    deadline?: Date;
    budget?: number;
    createdById: string;
}

export class JobService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new JobService(tenantId);
    }

    async getAll() {
        return await prisma.job.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { createdAt: "desc" },
            include: {
                client: { select: { name: true } },
                _count: { select: { transactions: true, documents: true } },
            },
        });
    }

    async getStats() {
        const activeJobs = await prisma.job.count({
            where: { tenantId: this.tenantId, status: "ACTIVE" },
        });

        // Placeholder until invoice module is connected.
        const pendingInvoices = 5;

        const revenue = await prisma.transaction.aggregate({
            where: {
                tenantId: this.tenantId,
                type: "INCOME",
            },
            _sum: { amount: true },
        });

        return {
            activeJobs,
            pendingInvoices,
            revenueThisMonth: revenue._sum.amount?.toString() || "0",
        };
    }

    async getById(id: string) {
        return await prisma.job.findUnique({
            where: { id, tenantId: this.tenantId },
            include: {
                client: true,
                items: {
                    include: {
                        requestedBy: { select: { name: true } },
                        approvedBy: { select: { name: true } },
                        producedBy: { select: { name: true } },
                        supplier: { select: { name: true } },
                    },
                },
                transactions: true,
                documents: true,
                allocations: {
                    include: {
                        freelancer: true,
                    },
                },
            },
        });
    }

    async create(data: CreateJobDTO) {
        return await prisma.job.create({
            data: {
                ...data,
                tenantId: this.tenantId,
                status: "ACTIVE",
            },
        });
    }

    async updateStatus(id: string, status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELED") {
        return await prisma.job.update({
            where: { id, tenantId: this.tenantId },
            data: { status },
        });
    }

    async delete(id: string) {
        return await prisma.job.delete({
            where: { id, tenantId: this.tenantId },
        });
    }
}
