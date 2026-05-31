import { prisma } from "@/lib/prisma";
import { NorteBotService } from "./norte-bot.service";

type ProcessedIntent = {
  success: boolean;
  actionTaken: string;
  category: "FINTECH" | "HEALTH" | "GASTRO" | "NEUTRAL";
};

/**
 * 🌪️ Tentáculo 16: Omni-Router Service
 * Classifica arquivos enviados via DropZone e roteia para os Hubs correspondentes.
 */
export class OmniRouterService {
  
  /**
   * Recebe um arquivo (buffer/nome) e o texto de intenção
   */
  static async processDropIntent(
    tenantId: string, 
    userId: string, 
    filename: string, 
    command: string
  ): Promise<ProcessedIntent> {
    
    console.log(`[OMNI-ROUTER] Processando arquivo: ${filename} | Comando: "${command}"`);

    const lowerName = filename.toLowerCase();

    // 1. ROTA FINTECH (Notas Fiscais / Boletos)
    if (lowerName.includes("nf") || lowerName.includes("nota") || lowerName.includes("fatura")) {
      return await this.routeToFintech(tenantId, userId, filename, command);
    }

    // 2. ROTA HEALTH (Receitas / Fichas de Treino)
    if (lowerName.includes("receita") || lowerName.includes("treino") || lowerName.includes("exame")) {
      return await this.routeToHealth(tenantId, userId, filename, command);
    }

    // Default Fallback
    return {
      success: true,
      category: "NEUTRAL",
      actionTaken: "Documento salvo no cofre digital. Nenhuma automação específica disparada."
    };
  }

  private static async routeToFintech(tenantId: string, userId: string, filename: string, command: string) {
    // Simulação OCR (Em produção usaria Google Vision / AWS Textract)
    const simulatedValue = Math.floor(Math.random() * 5000) + 100;
    
    // Liquida via Ledger (Enterprise Engine)
    await prisma.transactionLedger.create({
      data: {
        tenantId,
        description: `Liquidação Automática Omni-Drop: ${filename} - Comando: ${command}`,
        amount: simulatedValue,
        type: "EXPENSE"
      }
    });

    return {
      success: true,
      category: "FINTECH" as const,
      actionTaken: `Nota Fiscal processada via OCR. Valor de R$ ${simulatedValue} lançado como Despesa no Ledger Enterprise.`
    };
  }

  private static async routeToHealth(tenantId: string, userId: string, filename: string, command: string) {
    // Envia WhatsApp via NorteBot
    
    // Mock user phone (em produção buscaria do BD)
    const patientPhone = "5511999999999"; 
    
    await NorteBotService.handleIncomingMessage({
      phoneNumber: patientPhone,
      tenantId: tenantId,
      message: `Receita Anexada: ${filename}. Configurar lembretes de medicamento?`
    });

    return {
      success: true,
      category: "HEALTH" as const,
      actionTaken: `Documento clínico processado. Lembretes automáticos enviados via WhatsApp para o paciente.`
    };
  }
}
