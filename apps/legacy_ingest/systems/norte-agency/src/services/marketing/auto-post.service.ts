import { prisma } from "@/lib/prisma";

type MilestonePayload = {
  tenantId: string;
  userId: string;
  type: "CODE_MILESTONE" | "WORKOUT_PR" | "BUSINESS_WIN";
  metric: string; // Ex: "1000 linhas commitadas", "Supino 120kg"
};

/**
 * ðŸš€ TentÃ¡culo 19: Auto-Post Engine (O Motor de Autoridade)
 * Converte conquistas da vida real/cÃ³digo em peÃ§as de marketing geradas por I.A. 
 * e agenda para os horÃ¡rios de pico (OrquestraÃ§Ã£o).
 */
export class AutoPostService {

  /**
   * Gatilho disparado sempre que uma meta Ã© batida no ecossistema (VS Code Sync ou Performance Hub)
   */
  static async triggerMilestonePost(payload: MilestonePayload) {
    console.log(`[AUTO-POST] Nova conquista detectada: ${payload.type} -> ${payload.metric}`);

    // 1. Gera a CÃ³pia (Legenda) baseada no perfil Estoico/Dev
    const caption = this.generateCaptionForMilestone(payload.type, payload.metric);

    // 2. Simula a criaÃ§Ã£o de uma MÃ­dia via I.A. (Ex: DALL-E / Midjourney)
    const mediaUrl = `https://norte.cloud/assets/auto-generated/${payload.type.toLowerCase()}-${Date.now()}.png`;
    console.log(`[AUTO-POST] MÃ­dia gerada via I.A.: ${mediaUrl}`);

    // 3. Descobre o melhor horÃ¡rio de postagem via CÃ³rtex Neural / Scraper
    // Mock: Agendado para Ã s 18:30 (horÃ¡rio de pico padrÃ£o)
    const scheduledTime = new Date();
    scheduledTime.setHours(18, 30, 0, 0);
    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1); // Joga para amanhÃ£ se jÃ¡ passou
    }

    // 4. Salva no banco (SMM Hub) para o CronJob do Meta/YouTube puxar
    const socialAccount = await prisma.socialAccount.findFirst({
      where: { tenantId: payload.tenantId }
    });

    if (socialAccount) {
      await prisma.postSchedule.create({
        data: {
          content: caption,
          mediaUrls: [mediaUrl],
          scheduledFor: scheduledTime,
          status: "PENDING",
          socialAccountId: socialAccount.id,
          tenantId: payload.tenantId
        }
      });
      console.log(`[AUTO-POST] Post agendado com sucesso para ${scheduledTime.toLocaleString()}`);
    } else {
      console.log(`[AUTO-POST] Nenhuma conta Meta/Google vinculada para o Tenant ${payload.tenantId}`);
    }

    return { success: true, scheduledTime };
  }

  private static generateCaptionForMilestone(type: string, metric: string) {
    switch(type) {
      case "CODE_MILESTONE":
        return `O sistema nÃ£o dorme, e hoje a arquitetura ficou mais letal. Conquista: ${metric}. O cÃ³digo que vocÃª escreve constrÃ³i a sua liberdade. ðŸ’»âš¡ #DevLife #PUCSP #NorteHub`;
      case "WORKOUT_PR":
        return `Mente de arquiteto, corpo forjado na consistÃªncia. Novo PR atingido: ${metric}. A biologia e o cÃ³digo nÃ£o mentem, eles apenas reagem ao estÃ­mulo correto. ðŸ¦ðŸ”¥ #Stoic #Performance #2m10`;
      case "BUSINESS_WIN":
        return `Enquanto a maioria foca em curtidas, nosso ecossistema processa resultados reais: ${metric}. A Norte Hub Ã© infraestrutura em movimento. ðŸŒðŸ’¸ #systems #Business #Growth`;
      default:
        return `Mais um marco alcanÃ§ado no ecossistema Norte: ${metric}. Seguimos construindo! ðŸš€`;
    }
  }
}

