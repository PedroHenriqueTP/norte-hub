import { NextResponse } from 'next/server'
import { z } from 'zod'
import { dbService } from '@/utils/db'

const validateSchema = z.object({
  codigoBrinde: z.string().length(6, 'O código de resgate deve ter 6 caracteres'),
  promotorId: z.string().optional(),
  dispositivoId: z.string().optional()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validation = validateSchema.safeParse(body)
    if (!validation.success) {
      const errorMsg = validation.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ 
        success: false, 
        error: `Dados inválidos: ${errorMsg}` 
      }, { status: 400 })
    }

    const { codigoBrinde, promotorId, dispositivoId } = validation.data

    const result = await dbService.confirmRedemption(
      codigoBrinde, 
      promotorId || 'PROMO_BALCAO_01', 
      dispositivoId || 'TABLET_CLARO_01'
    )

    return NextResponse.json({
      success: true,
      message: 'Brinde validado e entregue com sucesso!',
      payload: result.payload,
      mode: result.mode
    }, { status: 200 })

  } catch (error: any) {
    console.error('API POST brinde validar error:', error)

    const isClientError = error.message.includes('inválido') || 
                          error.message.includes('expirado') || 
                          error.message.includes('não encontrado')

    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao processar validação no servidor' 
    }, { status: isClientError ? 400 : 500 })
  }
}
