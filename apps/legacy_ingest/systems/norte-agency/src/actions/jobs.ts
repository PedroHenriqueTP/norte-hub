"use server";

import { getAuthContext } from "@/services/auth-context";
import { JobService } from "@/services/jobs.service";
import { publishHubEvent } from "@/lib/hub-event-bus";
import { prisma } from "@/lib/prisma";
import { JobItemStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobAction(formData: FormData) {
    const { tenantId, userId } = await getAuthContext();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const clientId = formData.get("clientId") as string;
    const deadlineStr = formData.get("deadline") as string;
    const budgetStr = formData.get("budget") as string;

    if (!title || !clientId) {
        throw new Error("Title and Client are required");
    }

    let finalClientId = clientId;

    if (clientId === "STANDARD_CLIENT") {
        // Find or create "Cliente Padrão"
        // Use prisma directly since Service doesn't expose it
        const standardClient = await prisma.client.findFirst({
            where: { tenantId, name: "Cliente Padrão" }
        });

        if (standardClient) {
            finalClientId = standardClient.id;
        } else {
            const newClient = await prisma.client.create({
                data: {
                    tenantId,
                    name: "Cliente Padrão",
                    email: "padrao@exemplo.com", // Dummy
                    phone: "00000000000",
                    document: "000.000.000-00",
                    address: "N/A",
                    city: "N/A",
                    state: "N/A"
                }
            });
            finalClientId = newClient.id;
        }
    }

    const job = await JobService.with(tenantId).create({
        title,
        description,
        clientId: finalClientId,
        deadline: deadlineStr ? new Date(deadlineStr) : undefined,
        budget: budgetStr ? parseFloat(budgetStr) : 0,
        createdById: userId
    });

    await publishHubEvent({
        eventType: "agency.job.created",
        actor: { userId, tenantId },
        payload: {
            jobId: job.id,
            title: job.title,
            clientId: job.clientId,
            status: job.status,
            budget: Number(job.budget),
        },
    });

    revalidatePath("/jobs");
    redirect("/jobs");
}

export async function deleteJobAction(jobId: string) {
    const { tenantId, role, userId } = await getAuthContext();

    if (role !== "OWNER") {
        throw new Error("Unauthorized: Only Owners can delete jobs.");
    }

    await JobService.with(tenantId).delete(jobId);

    await publishHubEvent({
        eventType: "agency.job.deleted",
        actor: { userId, tenantId, role },
        payload: { jobId },
    });

    revalidatePath("/jobs");
}

export async function getSuperAdminStats() {
    return {
        totalTenants: 0,
        totalUsers: 0,
        globalMRR: "0",
    };
}

// --- Job Items ---

export async function addJobItemAction(jobId: string, data: any) {
    const { tenantId, userId } = await getAuthContext();

    const item = await prisma.jobItem.create({
        data: {
            jobId,
            tenantId,
            title: data.title || "Item",
            description: data.description,
            quantity: parseInt(data.quantity),
            unitPrice: parseFloat(data.unitPrice),
            unitCost: parseFloat(data.unitCost || 0),
            requestedById: userId,
            status: "BUDGETED"
        }
    });

    await publishHubEvent({
        eventType: "agency.job.item.created",
        actor: { userId, tenantId },
        payload: {
            jobId,
            itemId: item.id,
            title: item.title,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
        },
    });

    revalidatePath(`/jobs/${jobId}`);
}

export async function updateJobItemAction(itemId: string, data: any) {
    const { tenantId } = await getAuthContext();

    await prisma.jobItem.update({
        where: { id: itemId, tenantId }, // Ensure tenant isolation
        data: {
            title: data.title,
            description: data.description,
            quantity: parseInt(data.quantity),
            unitPrice: parseFloat(data.unitPrice),
            unitCost: parseFloat(data.unitCost),
            producedById: data.producedById || null
        }
    });

    // If updating context is needed, we can do it here.
    // For now simple field update.

    // Find job id to revalidate
    const item = await prisma.jobItem.findUnique({ where: { id: itemId }, select: { jobId: true } });
    if (item) revalidatePath(`/jobs/${item.jobId}`);
}

export async function deleteJobItemAction(itemId: string) {
    const { tenantId } = await getAuthContext();

    // Find job id first
    const item = await prisma.jobItem.findUnique({
        where: { id: itemId, tenantId },
        select: { jobId: true }
    });

    if (!item) throw new Error("Item not found");

    await prisma.jobItem.delete({
        where: { id: itemId }
    });

    revalidatePath(`/jobs/${item.jobId}`);
}

export async function updateJobItemStatusAction(itemId: string, newStatus: JobItemStatus) {
    const { tenantId, role, userId } = await getAuthContext();
    const canUpdate = ["OWNER", "DIRECTOR", "SUPERVISOR"].includes(role);

    if (!canUpdate) {
        throw new Error("Unauthorized: only leadership roles can update item status.");
    }

    const item = await prisma.jobItem.findUnique({
        where: { id: itemId, tenantId },
        select: { jobId: true },
    });

    if (!item) {
        throw new Error("Item not found");
    }

    await prisma.jobItem.update({
        where: { id: itemId, tenantId },
        data: {
            status: newStatus,
            approvedById: newStatus === "APPROVED" ? userId : undefined,
            receivedAt: newStatus === "DELIVERED" ? new Date() : undefined,
        },
    });

    revalidatePath(`/jobs/${item.jobId}`);
}

export async function approveJobBudgetAction(jobId: string) {
    const { tenantId, role, userId } = await getAuthContext();

    const canApprove = ["OWNER", "DIRECTOR", "SUPERVISOR"].includes(role);

    if (!canApprove) {
        throw new Error("Unauthorized: Only Owners, Directors or Supervisors can approve budgets.");
    }

    const job = await prisma.job.findUnique({
        where: { id: jobId, tenantId },
        include: { items: true }
    });

    if (!job) throw new Error("Job not found");

    // Update Job Status
    await prisma.job.update({
        where: { id: jobId },
        data: {
            status: "QUOTATION_APPROVED",
            // Optionally snapshot the budget
            budget: job.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0)
        }
    });

    // Update All Items Status
    // Ideally we would update only BUDGETED items, but for now approve all
    await prisma.jobItem.updateMany({
        where: { jobId: jobId, tenantId },
        data: { status: "APPROVED", approvedById: userId }
    });

    await publishHubEvent({
        eventType: "agency.job.budget.approved",
        actor: { userId, tenantId, role },
        payload: {
            jobId,
            itemCount: job.items.length,
            budget: job.items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0),
        },
    });

    revalidatePath(`/jobs/${jobId}`);
}
