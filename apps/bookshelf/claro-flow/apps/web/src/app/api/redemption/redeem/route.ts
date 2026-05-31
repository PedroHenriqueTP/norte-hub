import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dbService } from '@/utils/db'

const redeemSchema = z.object({
  qrCodeToken: z.string().min(1, 'Token QR Code é obrigatório'),
  giftId: z.string().min(1, 'ID do brinde é obrigatório')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = redeemSchema.safeParse(body)
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ 
        success: false, 
        error: `Dados inválidos: ${errorMsg}` 
      }, { status: 400 })
    }

    const { qrCodeToken, giftId } = validation.data

    const result = await dbService.checkoutRedemption(qrCodeToken, giftId)

    return NextResponse.json({
      success: true,
      message: 'Checkout de resgate realizado com sucesso! Aguardando validação física.',
      token: result.token,
      expiresAt: result.expiresAt,
      user: result.user,
      gift: result.gift,
      mode: result.mode
    }, { status: 200 })

  } catch (error: any) {
    console.error('API POST redeem error:', error)

    const isClientError = error.message.includes('esgotado') || 
                          error.message.includes('Pontos insuficientes') || 
                          error.message.includes('não encontrado') || 
                          error.message.includes('não credenciado')

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao realizar resgate no servidor' 
    }, { status: isClientError ? 400 : 500 })
  }
}
