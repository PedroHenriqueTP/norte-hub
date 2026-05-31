import { prisma } from "@/lib/prisma";

type InsightCategory = "DIET_PREFERENCE" | "WORKOUT_PATTERN" | "BUSINESS_INSIGHT" | "FINANCIAL_HEALTH";

/**
 * 🧠 Tentáculo 15: Córtex Neural (Context & Meta-Learning Engine)
 * RAG Persistente: Varre a telemetria do Polvo Norte para gerar e salvar
 * insights estratégicos na memória de longo prazo da I.A.
 */
export class NeuralCortexService {
  
  /**
   * Varredura Cronometrada (Engine de Extração)
   * Deve ser chamada via CRON Job a cada X horas.
   */
  static async sweepEcosystemAndGenerateInsights(tenantId: string) {
    console.log(`[CÓRTEX NEURAL] Iniciando varredura no Tenant: ${tenantId}...`);
    
    await this.analyzeFinancialPatterns(tenantId);
    await this.analyzeSocialAndPerformancePatterns(tenantId);

    console.log(`[CÓRTEX NEURAL] Varredura concluída. Memória atualizada.`);
    return { success: true };
  }

  /**
   * Analisa a Fintech (Digital Wallet e Ledger)
   */
  private static async analyzeFinancialPatterns(tenantId: string) {
    const recentExpenses = await prisma.transactionLedger.findMany({
      where: { tenantId, type: "EXPENSE" },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    if (recentExpenses.length > 10) {
      const totalGasto = recentExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
      
      if (totalGasto > 10000) {
        await this.saveInsight(
          tenantId,
          "FINANCIAL_HEALTH",
          "Alto volume de saídas detectado recentemente. O fluxo de caixa está acelerado. Sugerir pausa em contratações via The Architect."
        );
      }
    }
  }

  /**
   * Analisa o Performance Hub e o Social Graph
   */
  private static async analyzeSocialAndPerformancePatterns(tenantId: string) {
    const workouts = await prisma.socialEvent.findMany({
      where: { tenantId, type: "WORKOUT_COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    if (workouts.length >= 3) {
      // Exemplo simplificado de extração de contexto
      await this.saveInsight(
        tenantId,
        "WORKOUT_PATTERN",
        "Usuário possui alta consistência em treinos. A I.A. deve priorizar sugerir itens de alto valor (como Creatina ou Whey Premium) no Marketplace."
      );
    }
  }

  /**
   * Salva o Insight no Banco Vectorial (Simulado em JSON)
   */
  private static async saveInsight(tenantId: string, category: InsightCategory, content: string, userId?: string) {
    // Evita duplicatas de contexto recente
    const existing = await prisma.aIContext.findFirst({
      where: { tenantId, category, content }
    });

    if (!existing) {
      await prisma.aIContext.create({
        data: {
          tenantId,
          userId,
          category,
          content,
          // Em um RAG real com OpenAI, chamaríamos a API de embeddings aqui.
          // vector: await generateEmbeddings(content)
        }
      });
      console.log(`[CÓRTEX MEMÓRIA] Novo Insight Gravado: [${category}] ${content}`);
    }
  }

  /**
   * Retrieval: The Architect usa esse método antes de responder ao usuário.
   */
  static async retrieveContextForUser(tenantId: string, userId?: string) {
    const contexts = await prisma.aIContext.findMany({
      where: { tenantId, ...(userId && { userId }) },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    return contexts.map(c => c.content).join("\n");
  }
}
