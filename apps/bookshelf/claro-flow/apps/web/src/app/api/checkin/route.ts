import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dbService } from '@/utils/db'

const checkinSchema = z.object({
  eventId: z.string().min(1, 'ID do evento é obrigatório'),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(80),
  email: z.string().email('E-mail inválido').toLowerCase(),
  company: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const validation = checkinSchema.safeParse(body)
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ 
        success: false, 
        error: `Dados inválidos: ${errorMsg}` 
      }, { status: 400 })
    }

    const { eventId, name, email } = validation.data

    const result = await dbService.checkInUser(eventId, name, email)

    return NextResponse.json({
      success: true,
      message: result.isExisting ? 'Check-in recuperado com sucesso!' : 'Check-in realizado com sucesso!',
      isExisting: result.isExisting,
      qrCodeToken: result.data.qrCodeToken,
      user: result.data,
      mode: result.mode
    }, { status: result.isExisting ? 200 : 210 })

  } catch (error: any) {
    console.error('API POST checkin error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao processar o check-in no servidor' 
    }, { status: 500 })
  }
}
