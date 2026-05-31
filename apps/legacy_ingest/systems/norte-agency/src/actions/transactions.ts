"use server";

import { prisma } from "@/lib/prisma";
import { getTenantId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const transactionSchema = z.object({
    jobId: z.string().uuid(),
    description: z.string().min(3),
    amount: z.coerce.number().positive(),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.enum(["PRODUCTION", "LOGISTICS", "TALENT", "MARKETING", "TAXES", "OTHER"]),
    date: z.string().transform((str) => new Date(str)),
});

export type CreateTransactionState = {
    errors?: {
        description?: string[];
        amount?: string[];
        category?: string[];
    };
    message?: string;
} | null;

export async function createTransaction(prevState: CreateTransactionState, formData: FormData) {
    const tenantId = await getTenantId();

    const validatedFields = transactionSchema.safeParse({
        jobId: formData.get("jobId"),
        description: formData.get("description"),
        amount: formData.get("amount"),
        type: formData.get("type"),
        category: formData.get("category"),
        date: formData.get("date"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation Error",
        };
    }

    const { jobId, description, amount, type, category, date } = validatedFields.data;

    try {
        // Verify Job belongs to Tenant
        const job = await prisma.job.findFirst({
            where: { id: jobId, tenantId }
        });

        if (!job) {
            return { message: "Job not found or access denied." };
        }

        await prisma.transaction.create({
            data: {
                tenantId,
                jobId,
                description,
                amount,
                type,
                category,
                date,
                isVerified: true, // Manual entry is verified
            },
        });

        revalidatePath(`/dashboard/jobs/${jobId}`);
        return { message: "success" };

    } catch (e) {
        console.error("Transaction create error:", e);
        return { message: "Database Error: Failed to create transaction." };
    }
}
