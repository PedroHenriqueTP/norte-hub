import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { publishHubEvent } from "@/lib/hub-event-bus";

const prisma = new PrismaClient();

// Triage schema for the AI Agent
const triageSchema = z.object({
  interest: z.enum(["ORCAMENTO", "DUVIDA", "OUTRO"]).describe("A intenção principal do lead baseado na mensagem."),
  isHighValue: z.boolean().describe("Verdadeiro se o lead indicar alto orçamento, urgência, ou for uma grande empresa."),
  tags: z.array(z.string()).describe("Tags extraídas, ex: ['Móveis Planejados', 'Urgente']"),
  summary: z.string().describe("Um resumo curto da necessidade do lead."),
  estimatedScore: z.number().min(0).max(100).describe("Score de Valor Estimado de 0 a 100 baseado na intenção, urgência e aparente orçamento descrito pelo lead.")
});

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!apiKey) {
      return NextResponse.json({ error: "Unauthorized. Missing API Key." }, { status: 401 });
    }

    // 0. Autenticação via MarketplaceAsset ou Global Key
    let marketplace = await prisma.marketplaceAsset.findUnique({
      where: { apiKey }
    });

    const isGlobalKey = apiKey === process.env.SOBERANIA_NORTE_API_KEY;

    if (!marketplace && !isGlobalKey) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized. Invalid API Key." }, { status: 401 });
      }
    }

    const body = await req.json();
    const { name, email, phone, message, sourceSite } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: "Missing required fields (name, and email or phone)" }, { status: 400 });
    }

    // 1. Antigravity Triage Agent (AI AI-SDK) - Usando gpt-4o-mini para máxima velocidade
    let triageData = { interest: "OUTRO", isHighValue: false, tags: [], summary: "Sem mensagem detalhada", estimatedScore: 0 };
    
    if (message) {
      try {
        const { object } = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: triageSchema,
          prompt: `Analise a mensagem deste lead vindo de ${sourceSite || 'um dos nossos sites'}:
          Nome: ${name}
          Mensagem: "${message}"
          
          Classifique a intenção, determine se é de alto valor (orçamento alto ou empresa B2B), gere tags e atribua um Score de 0 a 100 estimando o quão valioso/quente este lead é.`,
        });
        triageData = object as any;
      } catch (aiError) {
        console.error("AI Triage failed, falling back to defaults", aiError);
      }
    }

    // 2. Find Tenant
    let tenant = null;
    
    if (sourceSite) {
      tenant = await prisma.tenant.findFirst({
        where: { slug: sourceSite }
      });
    }

    if (!tenant) {
      tenant = await prisma.tenant.findFirst({
        where: { slug: "soberania-norte" }
      });
    }

    if (!tenant) {
      tenant = await prisma.tenant.findFirst();
      if (!tenant) throw new Error("No tenant found");
    }

    // 3. Register Client with AI Tags
    const tagsString = triageData.tags.join(", ");
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address: `TAGS: [${triageData.interest}] ${tagsString} | RESUMO: ${triageData.summary} | SCORE: ${triageData.estimatedScore}`,
        document: sourceSite || "Webhook Lead", 
        tenantId: tenant.id,
      }
    });

    const firstUser = await prisma.user.findFirst({ where: { tenantId: tenant.id } });
    const actorUserId = firstUser?.id || "SYSTEM_LEAD_BOT";

    // 4. Create a Job if it's an "Orçamento"
    if (triageData.interest === "ORCAMENTO" && firstUser) {
      await prisma.job.create({
        data: {
          title: `Orçamento: ${name} (${sourceSite || 'Web'})`,
          description: triageData.summary,
          status: "QUOTATION_REQUESTED",
          clientId: newClient.id,
          tenantId: tenant.id,
          createdById: firstUser.id,
        }
      });
    }

    // 5. Ledger Entry & Marketplace Stats
    try {
      const { recordLedgerEntry } = await import("@/actions/billing");
      
      const targetTenantId = marketplace ? marketplace.tenantId : tenant.id;

      await recordLedgerEntry({
        tenantId: targetTenantId,
        amount: 5.00,
        description: `Lead capturado: ${name} (${triageData.interest})`,
        source: "LEAD_CAPTURE"
      });

      if (marketplace) {
        await prisma.marketplaceAsset.update({
          where: { id: marketplace.id },
          data: { totalLeads: { increment: 1 } }
        });
      }
    } catch (ledgerError) {
      console.error("Failed to register ledger entry for lead", ledgerError);
    }

    // 6. Alerta Prioritário via Hub Event Bus se Score > 80
    if (triageData.estimatedScore > 80 || triageData.isHighValue) {
      console.log(`🚀 [PRIORITY ALERT] Lead Quente detectado: ${name}! Score: ${triageData.estimatedScore}`);
      
      await publishHubEvent({
        eventType: "agency.lead.priority_alert",
        actor: { userId: actorUserId, tenantId: tenant.id },
        payload: {
          clientName: name,
          score: triageData.estimatedScore,
          summary: triageData.summary,
          interest: triageData.interest
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      client: newClient, 
      triage: triageData 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Webhook Leads Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
