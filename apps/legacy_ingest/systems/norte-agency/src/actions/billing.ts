"use server";

import { prisma } from "@/lib/prisma";
import { getAuthContext } from "@/services/auth-context";

// ==========================================
// 1. CONSOLIDATED BILLING (PAY-AS-YOU-GO)
// ==========================================
export type TenantBilling = {
  id: string;
  name: string;
  domain: string;
  activeUsers: number;
  totalJobs: number;
  totalLeads: number;
  estimatedInvoice: number;
};

export async function getConsolidatedBilling(): Promise<{
  tenants: TenantBilling[];
  globalMetrics: {
    totalRevenue: number;
    totalLeads: number;
    totalJobs: number;
  }
}> {
  const { role } = await getAuthContext();

  if (role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Only Super Admins can access consolidated billing.");
  }

  const BASE_RATE = 99;
  const PER_USER_RATE = 15;
  const PER_JOB_RATE = 5;
  const PER_LEAD_RATE = 1;

  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          users: true,
          jobs: true,
          clients: true,
        }
      }
    }
  });

  const billingData: TenantBilling[] = tenants.map(t => {
    const activeUsers = t._count.users;
    const totalJobs = t._count.jobs;
    const totalLeads = t._count.clients;

    const estimatedInvoice = BASE_RATE 
      + (activeUsers * PER_USER_RATE) 
      + (totalJobs * PER_JOB_RATE) 
      + (totalLeads * PER_LEAD_RATE);

    return {
      id: t.id,
      name: t.name,
      domain: t.slug + ".agencyos.com",
      activeUsers,
      totalJobs,
      totalLeads,
      estimatedInvoice
    };
  });

  billingData.sort((a, b) => b.estimatedInvoice - a.estimatedInvoice);

  const globalMetrics = billingData.reduce(
    (acc, curr) => {
      acc.totalRevenue += curr.estimatedInvoice;
      acc.totalLeads += curr.totalLeads;
      acc.totalJobs += curr.totalJobs;
      return acc;
    },
    { totalRevenue: 0, totalLeads: 0, totalJobs: 0 }
  );

  return {
    tenants: billingData,
    globalMetrics
  };
}

// ==========================================
// 2. LEDGER (MONEY FLOW) & SPLIT STRUCTURE
// ==========================================

type LedgerEntryPayload = {
  tenantId: string;
  amount: number;
  description: string;
  source: "LEAD_CAPTURE" | "JOB_COMPLETED" | "SUBSCRIPTION_FEE" | "CUSTOM";
  referenceId?: string;
};

/**
 * Registra um evento financeiro no Livro Razão (Ledger).
 * O split padrão define quanto a Norte (Hub) retém e quanto o Tenant (Agência) retém.
 */
export async function recordLedgerEntry(data: LedgerEntryPayload) {
  // Configuração do Gateway de Pagamento (Estrutura Preparada para Stripe/Pagar.me)
  const PAYMENT_GATEWAY_FEES = 0.0399; // Ex: 3.99% de taxa do cartão
  
  // Regras de Split de Transação
  let splitConfig = {
    norteFeePct: 0.10, // Norte retém 10%
    tenantFeePct: 0.90 // Tenant retém 90%
  };

  if (data.source === "LEAD_CAPTURE") {
    // Para captura de lead, é um custo para a agência pago à Norte.
    splitConfig = { norteFeePct: 1.0, tenantFeePct: 0.0 };
  }

  const netAmount = data.amount * (1 - PAYMENT_GATEWAY_FEES);
  const norteShare = netAmount * splitConfig.norteFeePct;
  const tenantShare = netAmount * splitConfig.tenantFeePct;

  console.log(`[LEDGER] Registrando Entrada: ${data.description}`);
  console.log(`[SPLIT] Bruto: R$${data.amount} | Líquido: R$${netAmount.toFixed(2)} | Norte: R$${norteShare.toFixed(2)} | Tenant: R$${tenantShare.toFixed(2)}`);

  // Registra no banco de dados como uma transação (Usando o modelo existente como MVP)
  // Como 'INCOME' representa entrada de dinheiro para a agência e 'EXPENSE' custo.
  // Se for LEAD_CAPTURE, é um expense para o tenant.
  const isExpense = data.source === "LEAD_CAPTURE" || data.source === "SUBSCRIPTION_FEE";

  const transaction = await prisma.transaction.create({
    data: {
      tenantId: data.tenantId,
      description: `[${data.source}] ${data.description}`,
      amount: data.amount, // Registramos o bruto
      type: isExpense ? "EXPENSE" : "INCOME",
      category: "MARKETING", // Categoria padrão ou mapeada dinamicamente
      date: new Date(),
      isVerified: false,
    }
  });

  return {
    success: true,
    transactionId: transaction.id,
    split: {
      gross: data.amount,
      net: netAmount,
      norteShare,
      tenantShare
    }
  };
}

// ==========================================
// 3. CASHBACK & DIGITAL WALLET 
// ==========================================

export async function redeemCashback() {
  const { tenantId } = await getAuthContext();

  const wallet = await prisma.digitalWallet.findUnique({
    where: { tenantId }
  });

  if (!wallet || Number(wallet.balance) <= 0) {
    throw new Error("Saldo insuficiente na Digital Wallet.");
  }

  const redeemAmount = Number(wallet.balance);

  // Zera a carteira
  await prisma.digitalWallet.update({
    where: { tenantId },
    data: { balance: 0 }
  });

  // Registra no Ledger como EXPENSE (Uso do Cashback)
  await prisma.transactionLedger.create({
    data: {
      tenantId,
      description: "Resgate de Cashback para abatimento de fatura",
      amount: redeemAmount,
      type: "EXPENSE"
    }
  });

  // Credita na fatura (Mockado como uma transação INCOME no fluxo normal para abater custos)
  await prisma.transaction.create({
    data: {
      tenantId,
      description: "Abatimento de Fatura via Cashback Norte",
      amount: redeemAmount,
      type: "INCOME",
      category: "OTHER",
      date: new Date(),
      isVerified: true
    }
  });

  return { success: true, redeemedAmount: redeemAmount };
}
