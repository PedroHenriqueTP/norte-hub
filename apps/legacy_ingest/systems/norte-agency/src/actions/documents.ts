"use server";

import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
    const tenantId = await getTenantId();
    if (!tenantId) return { message: "Unauthorized" };

    const file = formData.get("file") as File;
    const jobId = formData.get("jobId") as string;

    if (!file || !jobId) {
        return { message: "Missing file or job ID" };
    }

    try {
        // 1. Verify Job Ownership
        const job = await prisma.job.findFirst({
            where: { id: jobId, tenantId }
        });

        if (!job) return { message: "Job not found" };

        // 2. Mock File Upload (In production, upload to S3/Blob)
        // We'll just store a fake URL for now since we don't have S3 credentials
        const fakeUrl = `https://fake-storage.com/${tenantId}/${file.name}`;

        // 3. Create DB Record
        await prisma.document.create({
            data: {
                name: file.name,
                url: fakeUrl,
                jobId: jobId,
                tenantId,
                content: "Pending AI extraction...", // Placeholder
            }
        });

        revalidatePath(`/dashboard/jobs/${jobId}`);
        return { message: "success" };

    } catch (e) {
        console.error("Upload error:", e);
        return { message: "Failed to upload document" };
    }
}

export async function deleteDocument(documentId: string) {
    const tenantId = await getTenantId();

    // Verify ownership via Job->Tenant relation
    const doc = await prisma.document.findUnique({
        where: { id: documentId },
        include: { job: true }
    });

    if (!doc || doc.tenantId !== tenantId) {
        return { message: "Unauthorized or not found" };
    }

    await prisma.document.delete({
        where: { id: documentId }
    });

    revalidatePath(`/dashboard/jobs/${doc.jobId}`);
    return { message: "success" };
}
