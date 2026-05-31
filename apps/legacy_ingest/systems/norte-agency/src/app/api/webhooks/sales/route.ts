import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { processMarketplaceCheckout } from "@/actions/marketplace";

/**
 * Webhook Receptor: Acionado quando o Gateway de Pagamento (Stripe/Pagar.me) confirma a captura do dinheiro.
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Validação de Assinatura do Webhook (Omitida no Mock)
    const { marketplaceAssetId, orderTotal, resellerId, status } = payload;

    if (status !== "PAID") {
      return NextResponse.json({ message: "Ignored. Status not paid." });
    }

    // Aciona a Engine de Marketplace (Split + Ledgers + Push Notifications)
    const result = await processMarketplaceCheckout({
      marketplaceAssetId,
      orderTotal,
      resellerId,
      useCashbackBalance: 0 // Webhook externo não processa o saldo híbrido aqui, isso é feito no front-end
    });

    return NextResponse.json({ 
      success: true, 
      message: "Venda processada. Dopamina disparada.",
      splitDetails: result.split
    });

  } catch (error) {
    console.error("[WEBHOOK_SALES_ERROR]", error);
    return NextResponse.json({ error: "Erro interno ao processar webhook" }, { status: 500 });
  }
}
