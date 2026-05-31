"use server";

import { getAuthContext } from "@/services/auth-context";
import { FinanceService } from "@/services/finance.service";
import { publishHubEvent } from "@/lib/hub-event-bus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTransactionAction(formData: FormData) {
    const { tenantId, userId, role } = await getAuthContext();

    const description = formData.get("description") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const type = formData.get("type") as 'INCOME' | 'EXPENSE';
    const category = formData.get("category") as any;
    const date = new Date(formData.get("date") as string);
    const jobId = formData.get("jobId") as string; // Optional

    if (!description || !amount || !type || !date) {
        throw new Error("Missing required fields");
    }

    const transaction = await FinanceService.with(tenantId).create({
        description,
        amount,
        type,
        category,
        date,
        jobId: jobId || undefined
    });

    await publishHubEvent({
        eventType: "agency.finance.transaction.created",
        actor: { userId, tenantId, role },
        payload: {
            transactionId: transaction.id,
            amount: Number(transaction.amount),
            type: transaction.type,
            category: transaction.category,
            jobId: transaction.jobId,
        },
    });

    revalidatePath("/finance");
    redirect("/finance");
}
