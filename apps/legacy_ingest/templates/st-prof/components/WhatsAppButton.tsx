'use client'

import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export default function WhatsAppButton() {
    const handleClick = () => {
        const message = 'Olá! Gostaria de mais informações.'
        const url = getWhatsAppUrl(message)
        window.open(url, '_blank')
    }

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            aria-label="Contato via WhatsApp"
            title="Fale conosco no WhatsApp"
        >
            <MessageCircle className="h-6 w-6" />
        </button>
    )
}
