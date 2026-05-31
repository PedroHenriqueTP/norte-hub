import { NextResponse } from 'next/server'
import { dbService } from '@/utils/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token da carteira é obrigatório' 
      }, { status: 400 })
    }

    const userDetails = await dbService.getUserEventByToken(token)
    if (!userDetails) {
      return NextResponse.json({ 
        success: false, 
        error: 'Carteira não encontrada para este token' 
      }, { status: 404 })
    }

    // Get event details to fetch gifts list and activation points references
    const eventDetails = await dbService.getEventWithDetails(userDetails.eventId)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userDetails.id,
          name: userDetails.name,
          email: userDetails.email,
          qrCodeToken: userDetails.qrCodeToken,
          totalPoints: userDetails.totalPoints
        },
        event: userDetails.event,
        history: userDetails.history,
        redemptions: userDetails.redemptions,
        gifts: eventDetails?.gifts || []
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('API GET user wallet error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Falha ao recuperar dados da carteira' 
    }, { status: 500 })
  }
}
