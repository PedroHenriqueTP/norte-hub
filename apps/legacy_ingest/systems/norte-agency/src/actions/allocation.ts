"use server";

import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const allocationSchema = z.object({
    jobId: z.string().uuid(),
    freelancerId: z.string().uuid(),
    role: z.string().min(2),
    rate: z.coerce.number().positive(),
});

export type AllocationState = {
    message?: string;
} | null;

export async function allocateFreelancer(prevState: any, formData: FormData) {
    const tenantId = await getTenantId();

    if (!tenantId) return { message: "Unauthorized" };

    const parsed = allocationSchema.safeParse({
        jobId: formData.get("jobId"),
        freelancerId: formData.get("freelancerId"),
        role: formData.get("role"),
        rate: formData.get("rate"),
    });

    if (!parsed.success) {
        return { message: "Validation Error" };
    }

    const { jobId, freelancerId, rate } = parsed.data;

    try {
        // Check if job belongs to tenant
        const job = await prisma.job.findFirst({
            where: { id: jobId, tenantId }
        });

        if (!job) return { message: "Job not found" };

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        await prisma.jobAllocation.create({
            data: {
                jobId,
                freelancerId,
                tenantId,
                type: "FREELANCER",
                cost: rate,
                startDate,
                endDate,
            },
        });

        revalidatePath("/dashboard/talent");
        revalidatePath("/dashboard/jobs/" + jobId);
        return { message: "success" };
    } catch (e) {
        console.error("Allocation error:", e);
        return { message: "Database Error" };
    }
}

export async function getActiveJobsPlain() {
    const tenantId = await getTenantId();
    if (!tenantId) return [];

    return prisma.job.findMany({
        where: { tenantId, status: "ACTIVE" },
        select: { id: true, title: true, client: { select: { name: true } } }
    });
}
