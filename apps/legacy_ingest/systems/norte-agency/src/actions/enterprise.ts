"use server";

import { prisma } from "@/lib/prisma";

type PayrollBatchItem = {
  employeeId: string; // ID do Usuário (User)
  amount: number;
  description: string;
};

type MassPaymentPayload = {
  tenantId: string; // A empresa corporativa (ex: Cogitare / Lojas RPM)
  batchId: string;
  items: PayrollBatchItem[];
  paymentType: "SALARY" | "BONUS" | "COMMISSION";
};

/**
 * Motor Corporativo:
 * Executa folha de pagamento em lote e liquidação de comissões via Fintech Hub.
 * Transfere saldo da empresa para as Digital Wallets individuais dos colaboradores.
 */
export async function executeEnterprisePayroll(data: MassPaymentPayload) {
  console.log(`[ENTERPRISE ENGINE] Processando Lote de Pagamento ${data.batchId} para ${data.items.length} funcionários.`);

  let totalProcessedAmount = 0;
  let successCount = 0;
  let failedCount = 0;

  // Em um cenário de produção (10k+ usuários), usaríamos transações em lote ($transaction) 
  // do Prisma e possivelmente filas (SQS/RabbitMQ).
  
  for (const item of data.items) {
    try {
      // 1. Debita do Caixa da Empresa (Transação de Despesa no Ledger Global da Empresa)
      // Aqui assumimos que o tenantId da empresa é usado para debitar a conta mestra.
      await prisma.transactionLedger.create({
        data: {
          tenantId: data.tenantId,
          description: `[${data.paymentType}] Lote: ${data.batchId} - Pagamento para ${item.employeeId}`,
          amount: item.amount,
          type: "EXPENSE"
        }
      });

      // 2. Credita na Digital Wallet do Funcionário
      // No nosso modelo, a wallet do funcionário usa o userId (ou email) como tenantId da wallet privada dele.
      await prisma.digitalWallet.upsert({
        where: { tenantId: item.employeeId },
        create: {
          tenantId: item.employeeId,
          balance: item.amount
        },
        update: {
          balance: { increment: item.amount }
        }
      });

      totalProcessedAmount += item.amount;
      successCount++;
    } catch (error) {
      console.error(`Falha ao processar pagamento para ${item.employeeId}`, error);
      failedCount++;
    }
  }

  // 3. Telemetria de Saúde Financeira (Health Check Corporativo)
  const financialHealth = await analyzeEnterpriseHealth(data.tenantId, totalProcessedAmount);

  return { 
    success: true, 
    totalProcessedAmount,
    metrics: { success: successCount, failed: failedCount },
    financialHealthWarning: financialHealth.warning
  };
}

/**
 * Inteligência Financeira: Analisa se a folha de pagamento compromete a liquidez.
 */
async function analyzeEnterpriseHealth(tenantId: string, recentExpense: number) {
  // Simulando agregação de receitas do mês via Ledger
  const currentMonthIncome = await prisma.transactionLedger.aggregate({
    where: { 
      tenantId, 
      type: "INCOME",
      createdAt: { gte: new Date(new Date().setDate(1)) } // Desde o dia 1 do mês
    },
    _sum: { amount: true }
  });

  const income = Number(currentMonthIncome._sum.amount || 0);

  // Regra de Saúde: A folha de pagamento não deve ultrapassar 60% da receita líquida do mês (exemplo)
  if (income > 0 && (recentExpense / income) > 0.6) {
    return { warning: "CUIDADO: A folha de pagamento ultrapassou 60% da receita do mês. Considere pausar contratações ou impulsionar campanhas de Ads." };
  }

  return { warning: null };
}
