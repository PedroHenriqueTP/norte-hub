import { prisma } from "@/lib/prisma";
import { NorteBotService } from "./norte-bot.service";

type SocialMentionPayload = {
  platform: "INSTAGRAM" | "YOUTUBE" | "WHATSAPP";
  username: string;
  content: string;
  tenantId: string;
};

/**
 * 🌐 Tentáculo 17: Omni-Bridge Service (Malha de Conexão Global)
 * Roteador central para entrada de dados orgânicos (YouTube, Insta, WhatsApp).
 * Alimenta o Córtex Neural e o Social Hub simultaneamente.
 */
export class OmniBridgeService {
  
  /**
   * Recebe um evento (Webhook) de qualquer rede social conectada.
   */
  static async processSocialMention(payload: SocialMentionPayload) {
    console.log(`[OMNI-BRIDGE] Menção recebida no ${payload.platform} de @${payload.username}: "${payload.content}"`);

    // 1. Tenta identificar o usuário no banco (Lead ou Cliente existente)
    const user = await this.identifyUserInEcosystem(payload.username, payload.tenantId);

    // 2. Classificação de Intenção (Lead, Suporte, Feedback)
    const intention = this.classifyContent(payload.content);

    // 3. Resposta Simbionte via Norte-Bot
    await this.dispatchResponse(user, payload, intention);

    // 4. Salvar evento no Social Hub (SMM) para telemetria de Ads
    await prisma.socialMetric.create({
      data: {
        date: new Date(),
        comments: 1,
        tenantId: payload.tenantId,
        // Mock de SocialAccount
        socialAccountId: "mock-account-id" 
      }
    });

    return { success: true, intention };
  }

  private static async identifyUserInEcosystem(username: string, tenantId: string) {
    // Procura na base de clientes usando um campo dinâmico de rede social (aqui simplificado pelo nome/email)
    let client = await prisma.client.findFirst({
      where: { name: { contains: username, mode: "insensitive" }, tenantId }
    });

    if (!client) {
      // Se não existir, o Omni-Bridge cadastra automaticamente o Lead orgânico
      client = await prisma.client.create({
        data: {
          name: username,
          city: "Digital Lead (Social)",
          tenantId
        }
      });
      console.log(`[OMNI-BRIDGE] Novo Lead mapeado: @${username}`);
    }

    return client;
  }

  private static classifyContent(content: string) {
    const text = content.toLowerCase();
    if (text.includes("preço") || text.includes("comprar") || text.includes("link")) {
      return "LEAD_QUENTE";
    }
    if (text.includes("ajuda") || text.includes("erro") || text.includes("não funciona")) {
      return "SUPORTE";
    }
    return "ENGAJAMENTO";
  }

  private static async dispatchResponse(client: any, payload: SocialMentionPayload, intention: string) {
    let replyText = "";

    switch (intention) {
      case "LEAD_QUENTE":
        replyText = `Olá @${client.name}! Percebi seu interesse no nosso ecossistema. Use o cupom INSTA10 no Norte Checkout para garantir sua vaga hoje.`;
        break;
      case "SUPORTE":
        replyText = `Fala @${client.name}. The Architect detectou sua mensagem. Um ticket prioritário foi aberto no seu Dashboard.`;
        break;
      default:
        replyText = `Obrigado pelo comentário, @${client.name}! Continue acompanhando nossas novidades no Norte Stream.`;
    }

    // Se for WhatsApp, envia direto pelo NorteBot. Se for Insta/YouTube, a API deles seria acionada aqui.
    if (payload.platform === "WHATSAPP") {
      await NorteBotService.handleIncomingMessage({
        phoneNumber: client.phone || "unknown",
        tenantId: payload.tenantId,
        message: replyText
      });
    } else {
      console.log(`[API ${payload.platform}] Respondendo: "${replyText}"`);
    }
  }
}
