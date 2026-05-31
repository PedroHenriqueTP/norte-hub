"use server";

import { getAuthContext } from "@/services/auth-context";
import { ClientService } from "@/services/client.service";
import { publishHubEvent } from "@/lib/hub-event-bus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClientAction(formData: FormData) {
    const { tenantId, userId, role } = await getAuthContext();

    const name = formData.get("name") as string;
    const document = formData.get("document") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    // zipCode

    if (!name) {
        throw new Error("Name is required");
    }

    const client = await ClientService.with(tenantId).create({
        name,
        email,
        document,
        phone,
        address,
        city,
        state
    });

    await publishHubEvent({
        eventType: "agency.client.created",
        actor: { userId, tenantId, role },
        payload: {
            clientId: client.id,
            name: client.name,
            email: client.email,
        },
    });

    revalidatePath("/clients");
    redirect("/clients");
}
