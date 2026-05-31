"use server";

import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

type EnrollStudentPayload = {
  infoproductId: string;
  studentEmail: string;
  accessDurationDays?: number; // Se for assinatura, expira. Se não, infinito.
};

/**
 * Motor EdTech: Processa a matrícula de um aluno e libera acesso tokenizado
 * Acionado diretamente pelo motor de Marketplace após a confirmação do pagamento.
 */
export async function enrollStudent(data: EnrollStudentPayload) {
  console.log(`[INFOHUB] Iniciando matrícula para: ${data.studentEmail}`);

  const infoproduct = await prisma.infoproduct.findUnique({
    where: { id: data.infoproductId }
  });

  if (!infoproduct) {
    throw new Error("Infoproduto não encontrado.");
  }

  // Calcula a expiração, se for o caso
  let accessExpiry: Date | null = null;
  if (data.accessDurationDays) {
    accessExpiry = new Date();
    accessExpiry.setDate(accessExpiry.getDate() + data.accessDurationDays);
  }

  // Verifica se já existe, se não, cria
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: {
      infoproductId: data.infoproductId,
      studentEmail: data.studentEmail
    }
  });

  if (existingEnrollment) {
    console.log(`[INFOHUB] Matrícula renovada/atualizada para: ${data.studentEmail}`);
    await prisma.enrollment.update({
      where: { id: existingEnrollment.id },
      data: { accessExpiry, status: "ACTIVE" }
    });
  } else {
    console.log(`[INFOHUB] Nova matrícula criada para: ${data.studentEmail}`);
    await prisma.enrollment.create({
      data: {
        infoproductId: data.infoproductId,
        tenantId: infoproduct.tenantId,
        studentEmail: data.studentEmail,
        accessExpiry,
        status: "ACTIVE"
      }
    });
  }

  // Notifica o Brand Owner de que um novo aluno entrou
  await NotificationEngine.sendMobilePushNotification(
    infoproduct.tenantId,
    "🎓 Nova Matrícula Confirmada!",
    `O aluno ${data.studentEmail} acessou o infoproduto ${infoproduct.title}.`
  );

  return { success: true, message: "Acesso Tokenizado Gerado com Sucesso" };
}
