"use server";

import { getAuthContext } from "@/services/auth-context";
import { ProposalService } from "@/services/proposal.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProposalAction(formData: FormData) {
    const { tenantId, userId } = await getAuthContext();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const clientId = formData.get("clientId") as string;
    const validUntilStr = formData.get("validUntil") as string;

    // Parse items from JSON string (client-side will stringify)
    const itemsJson = formData.get("items") as string;
    let items: any[] = [];
    try {
        items = itemsJson ? JSON.parse(itemsJson) : [];
    } catch (e) {
        console.error("Failed to parse items", e);
    }

    if (!title || !clientId) {
        throw new Error("Title and Client are required");
    }

    await ProposalService.with(tenantId).create({
        title,
        description,
        clientId,
        validUntil: validUntilStr ? new Date(validUntilStr) : undefined,
        items: items.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice)
        }))
    });

    revalidatePath("/proposals");
    redirect("/proposals");
}
