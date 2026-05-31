import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

export type DashboardStats = {
    openJobsCount: number;
    clientsCount: number;
    suppliersCount: number;
    cashFlow: {
        income: number;
        expenses: number;
        balance: number;
    };
    todayAgenda: Array<{
        id: string;
        title: string;
        type: 'deadline' | 'allocation';
        time: Date;
    }>;
};

export class DashboardService {
    private tenantId: string;

    private constructor(tenantId: string) {
        this.tenantId = tenantId;
    }

    static with(tenantId: string) {
        return new DashboardService(tenantId);
    }

    async getStats(): Promise<DashboardStats> {
        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const dayStart = startOfDay(now);
        const dayEnd = endOfDay(now);

        // 1. Open Jobs (Status = ACTIVE or DRAFT)
        const openJobsCount = await prisma.job.count({
            where: {
                tenantId: this.tenantId,
                status: {
                    in: ['ACTIVE', 'DRAFT']
                }
            }
        });

        // 2. Clients Count
        const clientsCount = await prisma.client.count({
            where: { tenantId: this.tenantId }
        });

        // 3. Suppliers Count
        const suppliersCount = await prisma.supplier.count({
            where: { tenantId: this.tenantId }
        });

        // 4. Financials (Current Month)
        const transactions = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                tenantId: this.tenantId,
                date: {
                    gte: monthStart,
                    lte: monthEnd
                }
            },
            _sum: {
                amount: true
            }
        });

        let income = 0;
        let expenses = 0;

        transactions.forEach(t => {
            if (t.type === 'INCOME') income = Number(t._sum.amount || 0);
            if (t.type === 'EXPENSE') expenses = Number(t._sum.amount || 0);
        });

        // 5. Agenda (Jobs with deadlines today)
        const jobsDueToday = await prisma.job.findMany({
            where: {
                tenantId: this.tenantId,
                deadline: {
                    gte: dayStart,
                    lte: dayEnd
                }
            },
            select: {
                id: true,
                title: true,
                deadline: true
            },
            take: 5
        });

        const todayAgenda = jobsDueToday.map(job => ({
            id: job.id,
            title: `Entrega: ${job.title}`,
            type: 'deadline' as const,
            time: job.deadline!
        }));

        return {
            openJobsCount,
            clientsCount,
            suppliersCount,
            cashFlow: {
                income,
                expenses,
                balance: income - expenses
            },
            todayAgenda
        };
    }
}
