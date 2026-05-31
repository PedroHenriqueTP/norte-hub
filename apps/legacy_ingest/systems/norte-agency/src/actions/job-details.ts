"use server";

import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getJobDetails(jobId: string) {
    const tenantId = await getTenantId();

    if (!tenantId) throw new Error("Unauthorized");

    const job = await prisma.job.findFirst({
        where: {
            id: jobId,
            tenantId: tenantId,
        },
        include: {
            client: true,
            allocations: {
                include: {
                    freelancer: true,
                },
            },
            transactions: {
                orderBy: { date: "desc" },
            },
            documents: true,
            // @ts-ignore
            items: true,
            _count: {
                select: { documents: true },
            },
        },
    });

    if (!job) return null;

    // Calculate Financials
    const totalExpenses = job.transactions
        .filter((t: any) => t.type === "EXPENSE")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const totalIncome = job.transactions
        .filter((t: any) => t.type === "INCOME")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const margin = totalIncome - totalExpenses;

    return {
        ...job,
        financials: {
            totalExpenses,
            totalIncome,
            margin,
            budgetUsedPercent: Number(job.budget) > 0 ? (totalExpenses / Number(job.budget)) * 100 : 0,
        },
    };
}
