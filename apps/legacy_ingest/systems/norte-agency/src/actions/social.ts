"use server";

import { prisma } from "@/lib/prisma";

type PublishEventPayload = {
  userId: string;
  tenantId: string;
  type: string;
  content: string;
  metadata?: any;
};

/**
 * Motor de Social Graph:
 * Registra os eventos sociais que acontecem nos diversos Hubs (Fitness, Gastro, Vendas)
 * para exibição no Feed global do aplicativo.
 */
export async function publishSocialEvent(data: PublishEventPayload) {
  console.log(`[SOCIAL ENGINE] Novo evento registrado: ${data.type} por ${data.userId}`);

  const event = await prisma.socialEvent.create({
    data: {
      userId: data.userId,
      tenantId: data.tenantId,
      type: data.type,
      content: data.content,
      metadata: data.metadata || {}
    }
  });

  // Opcional: Adicionar lógica de gamificação/reputation aqui
  await prisma.profile.upsert({
    where: { userId: data.userId },
    create: {
      userId: data.userId,
      reputation: 10
    },
    update: {
      reputation: { increment: 10 }
    }
  });

  return { success: true, eventId: event.id };
}

/**
 * Resgata os últimos eventos do ecossistema para montar a "Timeline" (Feed de Dopamina)
 */
export async function getGlobalSocialFeed(tenantId: string, limit = 20) {
  const events = await prisma.socialEvent.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return events;
}
