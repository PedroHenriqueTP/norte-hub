import { prisma } from "@/lib/prisma";

type BotMessagePayload = {
  phoneNumber: string;
  message: string;
  tenantId: string;
};

/**
 * 🤖 Tentáculo 12: Norte Bot (The Brain)
 * Arquiteto de Sistemas de Mensageria para transbordo humano e automação de vendas.
 */
export class NorteBotService {
  
  /**
   * Processa a mensagem que chega via Webhook (WhatsApp API Oficial / Meta)
   */
  static async handleIncomingMessage(payload: BotMessagePayload) {
    console.log(`[NORTE BOT] Recebendo mensagem de ${payload.phoneNumber}: "${payload.message}"`);

    const lowerMsg = payload.message.toLowerCase();

    // Identifica o cliente (ou cria um novo Lead/Client caso não exista)
    let client = await prisma.client.findFirst({
      where: { phone: payload.phoneNumber, tenantId: payload.tenantId }
    });

    if (!client) {
      console.log(`[NORTE BOT] Novo número detectado. Criando Lead...`);
      client = await prisma.client.create({
        data: {
          name: "Cliente WhatsApp",
          phone: payload.phoneNumber,
          tenantId: payload.tenantId,
          city: "WhatsApp Lead"
        }
      });
    }

    // ROTAS DE INTENÇÃO (NLP Básico/Simulado)

    if (lowerMsg.includes("pedido") || lowerMsg.includes("status")) {
      return await this.handleOrderStatus(client.id, payload.tenantId);
    } 
    
    if (lowerMsg.includes("cashback") || lowerMsg.includes("saldo") || lowerMsg.includes("crédito")) {
      return await this.handleCashbackBalance(client.email || client.id, payload.tenantId);
    }

    // Default Fallback: Qualificação de Lead
    return this.sendReply(payload.phoneNumber, `Olá ${client.name}! Sou a assistente virtual da Norte. Como posso te ajudar hoje? Digite 'Saldo' para ver seu Cashback ou 'Pedido' para rastrear suas compras no Marketplace.`);
  }

  /**
   * Consulta o banco de dados Neon para verificar status de Job/Comanda
   */
  private static async handleOrderStatus(clientId: string, tenantId: string) {
    const activeJobs = await prisma.job.findMany({
      where: { clientId, tenantId, status: "IN_PROGRESS" },
      take: 1
    });

    if (activeJobs.length > 0) {
      return this.sendReply("number", `Seu pedido "${activeJobs[0].title}" está atualmente EM PRODUÇÃO. A previsão de conclusão é em breve!`);
    }

    return this.sendReply("number", "Você não tem pedidos ativos no momento. Que tal dar uma olhada no nosso Gastro Hub?");
  }

  /**
   * Consulta a DigitalWallet via Fintech Engine
   */
  private static async handleCashbackBalance(userIdentifier: string, tenantId: string) {
    // Busca a carteira pelo tenantId do usuário (ou identificador único)
    // No modelo atual, tenantId da Wallet está servindo como a conta única
    const wallet = await prisma.digitalWallet.findFirst({
      where: { tenantId: userIdentifier } 
    });

    if (wallet && wallet.balance > 0) {
      return this.sendReply("number", `Você possui R$ ${wallet.balance.toString()} em Cashback! 💸 Use-o para comprar Whey Protein na Norte Store ou em Cursos no InfoHub.`);
    }

    return this.sendReply("number", "Seu saldo de Cashback é R$ 0,00. Faça novas compras ou cumpra suas metas de treino para ganhar mais dopamina financeira!");
  }

  /**
   * Simula o envio via API Oficial do WhatsApp
   */
  private static async sendReply(phone: string, text: string) {
    console.log(`[WHATSAPP API -> ${phone}] ${text}`);
    return { success: true, replied: true, text };
  }
}
