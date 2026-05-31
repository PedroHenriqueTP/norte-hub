import { Resend } from 'resend';

// Initialize directly with env. In a real app, strict check.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'OmniSync <onboarding@resend.dev>'; // Or your verified domain

export async function sendSaleNotification(email: string, orderId: string, total: string) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Nova Venda! Pedido #${orderId}`,
            html: `
        <h1>Parabéns! Você realizou uma venda.</h1>
        <p>Pedido: <strong>#${orderId}</strong></p>
        <p>Valor: <strong>${total}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}">Ver Pedido</a>
      `
        });
    } catch (error) {
        console.error(`[Email Error] Failed to send sale email to ${email}:`, error);
    }
}

export async function sendLowStockNotification(email: string, productName: string, stock: number) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Alerta de Estoque: ${productName}`,
            html: `
        <h1>Estoque Baixo!</h1>
        <p>O produto <strong>${productName}</strong> está com apenas <strong>${stock}</strong> unidades.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/products">Repor Estoque</a>
      `
        });
    } catch (error) {
        console.error(`[Email Error] Failed to send stock email to ${email}:`, error);
    }
}

export async function sendSecurityNotification(email: string, message: string) {
    try {
        await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Alerta de Segurança OmniSync`,
            html: `
        <h1>Atenção Requerida</h1>
        <p>${message}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings">Verificar configurações</a>
      `
        });
    } catch (error) {
        console.error(`[Email Error] Failed to send security email to ${email}:`, error);
    }
}
