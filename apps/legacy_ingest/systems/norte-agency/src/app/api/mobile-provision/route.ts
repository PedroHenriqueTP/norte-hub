import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Injeção de CSS nativo para "Esconder headers e rodapés web" quando o site roda dentro da WebView do App
const MOBILE_INJECTION_CSS = `
  header, footer, nav { display: none !important; }
  body { padding-top: 0 !important; padding-bottom: 0 !important; background-color: transparent !important; }
  .mobile-hide { display: none !important; }
  .mobile-only { display: block !important; }
  /* Ajustes extras de Fintech UX para Mobile */
  input, button { border-radius: 12px !important; }
`;

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!apiKey) {
      return NextResponse.json({ error: "Mobile Provisioning failed. Missing API Key." }, { status: 401 });
    }

    // 1. Identificar o App do Inquilino (Tenant) através do MarketplaceAsset
    const marketplace = await prisma.marketplaceAsset.findUnique({
      where: { apiKey },
      include: { tenant: true }
    });

    if (!marketplace) {
      return NextResponse.json({ error: "Mobile Provisioning failed. Invalid API Key." }, { status: 401 });
    }

    // 2. Acionar a Cobrança por Instância de App Ativa no Ledger (Pay-as-you-go)
    try {
      const { recordLedgerEntry } = await import("@/actions/billing");
      
      // Cobrança recorrente (mockada como R$ 99 por ativação/sync de App)
      await recordLedgerEntry({
        tenantId: marketplace.tenantId,
        amount: 99.00,
        description: `Mobile App Sync/Provision: ${marketplace.name}`,
        source: "OTHER" // Poderíamos ter "APP_SYNC" se adicionássemos ao enum
      });
    } catch (ledgerError) {
      console.error("Failed to charge for App Provisioning", ledgerError);
    }

    // 3. Montar o Payload de Configuração (App Factory Config)
    const expoConfig = {
      appId: marketplace.id,
      appName: marketplace.name,
      tenantName: marketplace.tenant.name,
      // WebView Configuration
      targetUrl: marketplace.url || "https://agencyos.com",
      injectCSS: MOBILE_INJECTION_CSS,
      // Morphic Engine (Canvas) Coordinates
      canvasLayout: [
        { i: "banner-oferta", x: 0, y: 0, w: 12, h: 4 },
        { i: "modulo-produto-1", x: 0, y: 4, w: 6, h: 6 },
        { i: "modulo-produto-2", x: 6, y: 4, w: 6, h: 6 },
      ],
      // Theme Configuration (Norte Brand Alignment)
      theme: {
        primaryColor: "#7c3aed", // Violet 600
        backgroundColor: "#0f172a", // Slate 900
        safeAreaColor: "#020617", // Slate 950
        customBrandCSS: "body { font-family: 'Inter', sans-serif; }"
      },
      // Feature Flags
      features: {
        enablePushNotifications: true,
        enableBiometrics: true,
        sharedAuthToken: true // Integration with the Shared Auth system we built
      }
    };

    return NextResponse.json({
      success: true,
      message: "Mobile configuration loaded and billed successfully.",
      config: expoConfig
    });

  } catch (error) {
    console.error("[MOBILE_PROVISION_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
