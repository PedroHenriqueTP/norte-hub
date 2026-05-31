"use server";

import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

type MarketplaceCheckoutPayload = {
  marketplaceAssetId: string;
  orderTotal: number;
  resellerId?: string; // ID do Tenant revendedor, se aplicÃ¡vel (Drop-shipping/Drop-service)
  useCashbackBalance?: number; // Valor que o comprador final usou do prÃ³prio cashback
};

/**
 * Motor de Checkout do Marketplace (Split de Pagamentos & Ledger Integrado)
 * Calcula e distribui automaticamente:
 * 1. Lucro do Revendedor (Cashback/CrÃ©dito na Wallet)
 * 2. Taxa da Plataforma Norte (RetenÃ§Ã£o systems)
 * 3. Lucro da Marca PrÃ³pria (Creditado no Ledger da Marca)
 */
export async function processMarketplaceCheckout(data: MarketplaceCheckoutPayload) {
  console.log(`[MARKETPLACE ENGINE] Iniciando Checkout Simbionte. Order Total: R$${data.orderTotal}`);

  // ConfiguraÃ§Ã£o das Taxas
  const PAYMENT_GATEWAY_FEES = 0.0399; // Ex: Taxa Stripe/Pagar.me (3.99%)
  const NORTE_PLATFORM_FEE_PCT = 0.05; // Norte retÃ©m 5% de royalties
  const RESELLER_COMMISSION_PCT = data.resellerId ? 0.20 : 0; // Revendedor ganha 20%
  
  const netAmount = data.orderTotal * (1 - PAYMENT_GATEWAY_FEES);
  const norteShare = netAmount * NORTE_PLATFORM_FEE_PCT;
  const resellerShare = netAmount * RESELLER_COMMISSION_PCT;
  const brandOwnerShare = netAmount - norteShare - resellerShare;

  console.log(`[SPLIT] Net: R$${netAmount.toFixed(2)} | Norte: R$${norteShare.toFixed(2)} | Reseller: R$${resellerShare.toFixed(2)} | Brand: R$${brandOwnerShare.toFixed(2)}`);

  // Identifica a Marca (Brand Owner) vinculada ao MarketplaceAsset
  const marketplace = await prisma.marketplaceAsset.findUnique({
    where: { id: data.marketplaceAssetId },
    include: { tenant: true }
  });

  if (!marketplace) {
    throw new Error("Marketplace Asset nÃ£o encontrado.");
  }

  // 1. Atualiza MÃ©tricas Globais da Vitrine
  await prisma.marketplaceAsset.update({
    where: { id: data.marketplaceAssetId },
    data: {
      totalSales: { increment: data.orderTotal }
    }
  });

  // 2. TransaÃ§Ã£o Ledger - Lucro da Marca PrÃ³pria (Creditado no Fluxo de Caixa da AgÃªncia/Marca)
  await prisma.transaction.create({
    data: {
      tenantId: marketplace.tenantId,
      description: `[MARKETPLACE SALE] Pedido recebido na vitrine: ${marketplace.name}`,
      amount: brandOwnerShare,
      type: "INCOME",
      category: "PRODUCTION",
      date: new Date(),
      isVerified: true
    }
  });

  // 3. Alimentar Carteira Digital do Revendedor (Se Houver)
  if (data.resellerId && resellerShare > 0) {
    // Tenta encontrar ou criar a Digital Wallet do Revendedor
    await prisma.digitalWallet.upsert({
      where: { tenantId: data.resellerId },
      create: {
        tenantId: data.resellerId,
        balance: resellerShare
      },
      update: {
        balance: { increment: resellerShare }
      }
    });

    // Registra a entrada de comissÃ£o no Ledger do Revendedor
    await prisma.transactionLedger.create({
      data: {
        tenantId: data.resellerId,
        description: `[COMISSÃƒO] Venda Drop-service/Drop-shipping via ${marketplace.name}`,
        amount: resellerShare,
        type: "INCOME"
      }
    });

    // ðŸ’¥ DISPARO DE DOPAMINA: WebSockets + Firebase Push Notification
    await NotificationEngine.fireDopamineCombo(data.resellerId, resellerShare);
  }

  // 4. Se o usuÃ¡rio usou Cashback para pagar parte da compra, debita do Ledger dele
  // (LÃ³gica adicional seria verificar o Auth Context do comprador B2C, omitido aqui para manter o foco B2B/Franquia)

  return {
    success: true,
    split: {
      norteShare,
      resellerShare,
      brandOwnerShare
    }
  };
}

