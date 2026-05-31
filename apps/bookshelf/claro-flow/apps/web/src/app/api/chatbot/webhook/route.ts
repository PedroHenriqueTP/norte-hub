import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    replyText: "Olá! Chatbot temporariamente em manutenção para integração com a nova carteira de gamificação Claro."
  }, { status: 200 })
}
