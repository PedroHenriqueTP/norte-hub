"use server";

import { prisma } from "@/lib/prisma";

type CompleteTaskPayload = {
  taskId: string;
  userId: string;
  tenantId: string;
};

/**
 * Motor Simbionte de Performance:
 * Cruza a conclusão de uma tarefa corporativa com a gamificação do ecossistema.
 * Bater meta no trabalho = Cashback/Créditos no bolso.
 */
export async function completeCorporateTask(data: CompleteTaskPayload) {
  console.log(`[PERFORMANCE HUB] Tarefa ${data.taskId} sendo finalizada pelo usuário ${data.userId}`);

  // 1. Busca a Task
  const task = await prisma.taskBoard.findUnique({
    where: { id: data.taskId }
  });

  if (!task || task.status === "DONE") {
    throw new Error("Task não encontrada ou já finalizada.");
  }

  // 2. Atualiza a Task para DONE
  await prisma.taskBoard.update({
    where: { id: data.taskId },
    data: { status: "DONE" }
  });

  // 3. Sistema de Recompensa (Bio-Hacking Corporativo)
  const rewardPoints = Number(task.rewardPoints);
  if (rewardPoints > 0) {
    console.log(`[DOPAMINA CORPORATIVA] Recompensando funcionário com R$${rewardPoints} em Cashback.`);

    // Injeta o saldo diretamente na Carteira Digital do Usuário (Norte Fintech)
    await prisma.digitalWallet.upsert({
      where: { tenantId: data.userId }, // Usando userId como tenantId individual na carteira para o cenário B2E
      create: {
        tenantId: data.userId,
        balance: rewardPoints
      },
      update: {
        balance: { increment: rewardPoints }
      }
    });

    // Registra a bonificação de performance no Ledger
    await prisma.transactionLedger.create({
      data: {
        tenantId: data.userId,
        description: `[BÔNUS DE PERFORMANCE] Conclusão da tarefa: ${task.title}`,
        amount: rewardPoints,
        type: "INCOME"
      }
    });

    return { success: true, reward: rewardPoints, message: "Task finalizada e dopamina financeira injetada!" };
  }

  return { success: true, reward: 0, message: "Task finalizada." };
}

type SyncBioDataPayload = {
  userId: string;
  tenantId: string;
  routineId: string;
  metrics: {
    avgHeartRate: number;
    stepsCount: number;
    caloriesBurn: number;
  };
};

/**
 * Norte Health Sync (Integração de Wearables)
 * Puxa dados biológicos e cruza com a recomendação de Suplementação no Marketplace
 */
export async function syncBioData(data: SyncBioDataPayload) {
  console.log(`[BIO-SYNC] Recebendo telemetria do Apple Watch/Garmin do usuário ${data.userId}`);

  await prisma.physicalRoutine.update({
    where: { id: data.routineId },
    data: {
      avgHeartRate: data.metrics.avgHeartRate,
      stepsCount: data.metrics.stepsCount,
      caloriesBurn: data.metrics.caloriesBurn,
    }
  });

  // Lógica de Inteligência: Se a queima calórica for muito alta, recomenda suplemento
  let marketplaceSuggestion = null;
  if (data.metrics.caloriesBurn > 800) {
    marketplaceSuggestion = {
      product: "Norte Whey Protein Isolado",
      message: "Queima calórica agressiva detectada. Sugerimos reposição proteica. Use seus Créditos de Performance no Norte Store."
    };
  }

  return { success: true, marketplaceSuggestion };
}
