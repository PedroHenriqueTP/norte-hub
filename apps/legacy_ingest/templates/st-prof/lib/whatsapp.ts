/**
 * Gera URL do WhatsApp com mensagem pré-formatada
 */
export function getWhatsAppUrl(message: string): string {
    const phoneNumber = process.env.BUSINESS_WHATSAPP_NUMBER || '+5511999999999'
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Formata dados do formulário de contato para mensagem WhatsApp
 */
export function formatContactMessage(data: {
    name: string
    email: string
    phone: string
    message: string
}): string {
    return `*Novo contato do site*\n\n*Nome:* ${data.name}\n*Email:* ${data.email}\n*Telefone:* ${data.phone}\n\n*Mensagem:*\n${data.message}`
}
