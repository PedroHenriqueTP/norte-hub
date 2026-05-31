import { prisma } from "@/lib/prisma";

// Mock das SDKs de Mensageria em Tempo Real
// Em produção: import Pusher from "pusher";
// Em produção: import * as admin from "firebase-admin";

export class NotificationEngine {
  /**
   * Dispara o evento de WebSockets para o Dashboard em tempo real (Pusher/Socket.io)
   */
  static async triggerRealtimeSaleEvent(tenantId: string, data: { amount: number, commission: number }) {
    console.log(`[WEBSOCKET -> ${tenantId}] SALE_CONFIRMED emitido.`);
    console.log(`[WEBSOCKET PAYLOAD]`, data);
    // pusher.trigger(`private-tenant-${tenantId}`, 'SALE_CONFIRMED', data);
  }

  /**
   * Dispara a Push Notification via Firebase Cloud Messaging para o App Mobile
   */
  static async sendMobilePushNotification(tenantId: string, title: string, body: string) {
    // Busca o FCM Token atrelado aos usuários/dispositivos daquele Tenant
    // const devices = await prisma.deviceToken.findMany({ where: { tenantId } });
    
    console.log(`[FIREBASE FCM -> ${tenantId}] Push Notification Enviada!`);
    console.log(`[FCM TITLE] ${title}`);
    console.log(`[FCM BODY] ${body}`);

    // const message = { notification: { title, body }, tokens: devices.map(d => d.token) };
    // await admin.messaging().sendMulticast(message);
  }

  /**
   * Dispara a dopamina: Socket + Push em um único combo letal
   */
  static async fireDopamineCombo(resellerId: string, commissionAmount: number) {
    const formattedAmount = commissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    // 1. Atualiza a tela do desktop/app ao vivo
    await this.triggerRealtimeSaleEvent(resellerId, { 
      amount: commissionAmount, 
      commission: commissionAmount 
    });

    // 2. Faz o celular vibrar no bolso
    await this.sendMobilePushNotification(
      resellerId,
      "🚀 Nova Venda Realizada!",
      `Você acaba de ganhar R$ ${formattedAmount} de comissão na Norte Store!`
    );
  }
}
