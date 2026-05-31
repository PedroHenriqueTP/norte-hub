"use server";

import { getAuthContext } from "@/services/auth-context";
import { SupplierService } from "@/services/supplier.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSupplierAction(formData: FormData) {
    const { tenantId } = await getAuthContext();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const document = formData.get("document") as string;
    const phone = formData.get("phone") as string;
    const category = formData.get("category") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;

    if (!name) {
        throw new Error("Name is required");
    }

    await SupplierService.with(tenantId).create({
        name,
        email,
        document,
        phone,
        category,
        address,
        city,
        state
    });

    revalidatePath("/suppliers");
    redirect("/suppliers");
}
