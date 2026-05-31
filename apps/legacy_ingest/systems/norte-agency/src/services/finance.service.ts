import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export type CreateTransactionDTO = {
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: 'PRODUCTION' | 'LOGISTICS' | 'TALENT' | 'MARKETING' | 'TAXES' | 'OTHER';
    date: Date;
    jobId?: string;
    supplier?: string;
}

export class FinanceService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new FinanceService(tenantId);
    }

    async getMonthSummary() {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const transactions = await prisma.transaction.findMany({
            where: {
                tenantId: this.tenantId,
                date: { gte: start, lte: end }
            },
            orderBy: { date: 'desc' },
            include: { job: true }
        });

        const income = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return {
            transactions,
            income,
            expenses,
            balance: income - expenses
        };
    }

    async getAllTransactions() {
        return await prisma.transaction.findMany({
            where: { tenantId: this.tenantId },
            orderBy: { date: 'desc' },
            include: { job: true }
        });
    }

    async create(data: CreateTransactionDTO) {
        if (!data.jobId) {
            throw new Error("jobId is required to create a transaction");
        }

        const job = await prisma.job.findUnique({
            where: { id: data.jobId, tenantId: this.tenantId }
        });

        if (!job) {
            throw new Error("Job not found or access denied");
        }

        return await prisma.transaction.create({
            data: {
                ...data,
                tenantId: this.tenantId,
                jobId: data.jobId
            }
        });
    }
}
