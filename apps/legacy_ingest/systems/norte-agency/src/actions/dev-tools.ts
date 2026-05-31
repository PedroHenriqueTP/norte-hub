"use server";

import { getAuthContext } from "@/services/auth-context";
import { ClientService } from "@/services/client.service";
import { JobService } from "@/services/jobs.service";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createDummyClientAction() {
    const { tenantId } = await getAuthContext();
    const timestamp = new Date().toLocaleTimeString();

    await ClientService.with(tenantId).create({
        name: `Cliente Teste ${timestamp}`,
        email: `cliente.${Date.now()}@teste.com`,
        phone: "11999999999",
        document: "000.000.000-00",
        address: "Rua Teste, 123",
        city: "São Paulo",
        state: "SP"
    });

    revalidatePath("/clients");
    revalidatePath("/dashboard");
}

export async function createDummySupplierAction() {
    const { tenantId } = await getAuthContext();
    const timestamp = new Date().toLocaleTimeString();

    // Assuming SupplierService exists or using Prisma directly if not
    // I will use Prisma directly to be safe if Service is not fully implemented or simple enough
    // Use prisma directly
    await prisma.supplier.create({
        data: {
            tenantId,
            name: `Fornecedor Teste ${timestamp}`,
            email: `fornecedor.${Date.now()}@teste.com`,
            phone: "11988888888",
            category: "Geral"
        }
    });

    revalidatePath("/suppliers");
    revalidatePath("/dashboard");
}

export async function createDummyJobAction() {
    const { tenantId, userId } = await getAuthContext();
    const timestamp = new Date().toLocaleTimeString();

    // 1. Get a client
    const client = await prisma.client.findFirst({
        where: { tenantId }
    });

    let clientId = client?.id;

    if (!clientId) {
        const newClient = await prisma.client.create({
            data: {
                tenantId,
                name: "Cliente Padrão (Auto)",
                email: "auto@teste.com",
                document: "000",
            }
        });
        clientId = newClient.id;
    }

    await JobService.with(tenantId).create({
        title: `Job Rápido ${timestamp}`,
        description: "Job criado via Quick Actions para testes.",
        clientId: clientId,
        budget: 1000,
        deadline: new Date(Date.now() + 86400000 * 7), // +7 days
        createdById: userId
    });

    revalidatePath("/jobs");
    revalidatePath("/dashboard");
}
