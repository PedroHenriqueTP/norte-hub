import { prisma } from "@/lib/prisma";
import { ProposalStatus } from "@prisma/client";

export type CreateProposalDTO = {
    title: string;
    description?: string;
    clientId: string;
    validUntil?: Date;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
    }[];
    createdById?: string; // Optional track who created
};

export class ProposalService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new ProposalService(tenantId);
    }

    async create(data: CreateProposalDTO) {
        // Calculate total value
        const totalValue = data.items.reduce((acc, item) => {
            return acc + (item.quantity * item.unitPrice);
        }, 0);

        return prisma.proposal.create({
            data: {
                title: data.title,
                description: data.description,
                clientId: data.clientId,
                tenantId: this.tenantId,
                validUntil: data.validUntil,
                value: totalValue,
                status: 'DRAFT',
                items: {
                    create: data.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        tenant: {
                            connect: { id: this.tenantId },
                        },
                    }))
                }
            }
        });
    }

    async getAll() {
        return prisma.proposal.findMany({
            where: { tenantId: this.tenantId },
            include: {
                client: true,
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getById(id: string) {
        return prisma.proposal.findUnique({
            where: { id, tenantId: this.tenantId },
            include: {
                client: true,
                items: true
            }
        });
    }

    async updateStatus(id: string, status: ProposalStatus) {
        return prisma.proposal.update({
            where: { id, tenantId: this.tenantId },
            data: { status }
        });
    }
}
