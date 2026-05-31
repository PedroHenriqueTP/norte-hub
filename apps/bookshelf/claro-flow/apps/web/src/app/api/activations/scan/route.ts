import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dbService } from '@/utils/db'

const scanSchema = z.object({
  qrCodeToken: z.string().min(1, 'Token QR Code é obrigatório'),
  activationId: z.string().min(1, 'ID da ativação é obrigatório')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = scanSchema.safeParse(body)
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ 
        success: false, 
        error: `Dados inválidos: ${errorMsg}` 
      }, { status: 400 })
    }

    const { qrCodeToken, activationId } = validation.data

    const result = await dbService.scanActivation(qrCodeToken, activationId)

    return NextResponse.json({
      success: true,
      message: 'Pontos computados com sucesso!',
      pointsEarned: result.log.pointsEarned,
      totalPoints: result.user.totalPoints,
      user: result.user,
      log: result.log,
      mode: result.mode
    }, { status: 200 })

  } catch (error: any) {
    console.error('API POST activation scan error:', error)
    
    // Cooldown or not found errors
    const isClientError = error.message.includes('Aguarde') || 
                          error.message.includes('não encontrada') || 
                          error.message.includes('não credenciado')

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao registrar pontuação no servidor' 
    }, { status: isClientError ? 400 : 500 })
  }
}
