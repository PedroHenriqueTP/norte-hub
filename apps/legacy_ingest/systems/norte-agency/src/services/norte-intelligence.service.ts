import { prisma } from "@/lib/prisma";
import { NotificationEngine } from "@/lib/notifications";

type IncomingEmailPayload = {
  fromEmail: string;
  subject: string;
  body: string;
  tenantId: string;
};

/**
 * 🧠 Tentáculo 10: Norte Core Intelligence (The Architect)
 * A Secretária I.A. Simbionte que orquestra vida, negócios e delega tarefas.
 */
export class NorteIntelligenceService {
  
  /**
   * Omni-Channel Sync: Escuta emails via Webhooks (Simulado)
   * Processa NLP para entender a intenção e delegar ações aos sub-agentes.
   */
  static async processIncomingCommunication(data: IncomingEmailPayload) {
    console.log(`[CORE INTELLIGENCE] Processando mensagem de: ${data.fromEmail}`);

    // Mock de Processamento de Linguagem Natural (NLP)
    const isBudgetRequest = data.subject.toLowerCase().includes("orçamento") || data.body.toLowerCase().includes("proposta");
    const isBioEmergency = data.body.toLowerCase().includes("exausto") || data.body.toLowerCase().includes("dormi mal");

    if (isBudgetRequest) {
      console.log(`[CORE INTELLIGENCE] 🎯 Intenção detectada: Pedido de Orçamento (Lead Quente).`);
      await this.dispatchSalesAgent(data);
    } else if (isBioEmergency) {
      console.log(`[CORE INTELLIGENCE] 🔋 Intenção detectada: Exaustão Biológica.`);
      await this.dispatchBioHackingConcierge(data.tenantId);
    } else {
      console.log(`[CORE INTELLIGENCE] 🔄 Intenção detectada: Comunicação Geral. Arquivando na Inbox.`);
    }

    return { success: true, processed: true };
  }

  /**
   * Despacho de Agentes: O agente de vendas monta o PPTX via pptxgenjs (simulado)
   * e notifica o dono da agência.
   */
  private static async dispatchSalesAgent(data: IncomingEmailPayload) {
    console.log(`[AGENT: SALES] Montando Apresentação de ROI (PPTX) para ${data.fromEmail}...`);
    
    // Injeta o Lead no Neon DB automaticamente
    const newLead = await prisma.client.create({
      data: {
        tenantId: data.tenantId,
        name: data.fromEmail.split("@")[0],
        email: data.fromEmail,
        city: "Desconhecido (Via Email)"
      }
    });

    // Simula a criação de um TaskBoard para a equipe seguir com o Lead
    await prisma.taskBoard.create({
      data: {
        tenantId: data.tenantId,
        userId: "system-auto", // Idealmente o ID do líder de vendas
        title: `📞 Fechar Orçamento: ${newLead.name}`,
        description: `Lead recebido via Email. Apresentação ROI gerada pelo Agente Automático.`,
        rewardPoints: 50.00 // Recompensa a equipe se fechar a venda
      }
    });

    // Dispara Notificação no Celular do Dono
    await NotificationEngine.sendMobilePushNotification(
      data.tenantId,
      "🤖 Agente de Vendas Ativado!",
      `Lead ${newLead.name} capturado. Apresentação de ROI gerada e enviada para aprovação.`
    );
  }

  /**
   * Bio-Feedback Concierge: Cancela reuniões não essenciais e sugere alimentação 
   * baseada no Gastro Hub.
   */
  private static async dispatchBioHackingConcierge(tenantId: string) {
    console.log(`[AGENT: BIO-HACKER] Remanejando agenda para priorizar descanso.`);
    
    await NotificationEngine.sendMobilePushNotification(
      tenantId,
      "⚠️ Alerta de Baixa Energia (Apple Watch Sync)",
      "Cancelei suas reuniões não-essenciais da tarde. Pedi um prato rico em proteínas no Gastro Hub para sua recuperação."
    );
  }

  /**
   * Analisa a carga de trabalho de todos os funcionários na TaskBoard 
   * e sugere delegações para manter a sanidade e a performance da equipe.
   */
  static async analyzeWorkloadDistributions(tenantId: string) {
    const pendingTasks = await prisma.taskBoard.count({
      where: { tenantId, status: "TODO" }
    });

    return {
      status: pendingTasks > 20 ? "SOBRECARGA DETECTADA" : "FLUXO OTIMIZADO",
      suggestion: pendingTasks > 20 ? "Acionar Agente de Terceirização (Drop-Service)" : "Manter operação interna.",
      pendingTasks
    };
  }
}
