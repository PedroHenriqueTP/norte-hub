"use server";

import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJobItem(data: {
    jobId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
}) {
    const tenantId = await getTenantId();
    if (!tenantId) return { message: "Unauthorized" };

    try {
        // Validation: Ensure job belongs to tenant
        const job = await prisma.job.findFirst({
            where: { id: data.jobId, tenantId }
        });

        if (!job) return { message: "Job not found" };

        // @ts-ignore - JobItem not yet generated in client
        await prisma.jobItem.create({
            data: {
                tenantId,
                jobId: data.jobId,
                description: data.description,
                quantity: data.quantity,
                unitPrice: data.unitPrice,
                unitCost: data.unitCost,
            }
        });

        revalidatePath(`/jobs/${data.jobId}`);
        return { message: "success" };
    } catch (e) {
        console.error("Create JobItem Error:", e);
        return { message: "Failed to create item" };
    }
}

export async function deleteJobItem(id: string, jobId: string) {
    const tenantId = await getTenantId();
    if (!tenantId) return { message: "Unauthorized" };

    try {
        // @ts-ignore
        await prisma.jobItem.deleteMany({
            where: {
                id,
                tenantId // Ensure ownership
            }
        });

        revalidatePath(`/jobs/${jobId}`);
        return { message: "success" };
    } catch (e) {
        return { message: "Failed to delete item" };
    }
}
