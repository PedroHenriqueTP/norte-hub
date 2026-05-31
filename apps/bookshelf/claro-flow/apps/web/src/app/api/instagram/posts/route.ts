import { NextResponse } from 'next/server'
import { dbService } from '@/utils/db'

export async function GET() {
  try {
    const posts = await dbService.getInstagramPosts()
    return NextResponse.json({ success: true, posts }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { qrCodeToken, username, photoIdx } = await request.json()
    if (!qrCodeToken || !username || photoIdx === undefined) {
      return NextResponse.json({ success: false, error: 'Dados incompletos.' }, { status: 400 })
    }

    const cleanToken = qrCodeToken.trim().toUpperCase()
    const userDetails = await dbService.getUserEventByToken(cleanToken)
    if (!userDetails) {
      return NextResponse.json({ success: false, error: 'Jogador não credenciado.' }, { status: 404 })
    }

    const eventId = userDetails.eventId
    const isF1 = eventId === 'f1-interlagos'
    const activationId = isF1 ? 'f1-instagram' : 'bienal-instagram'

    // 1. Log photo in the moderation queue
    const post = await dbService.addInstagramPost(eventId, username, photoIdx)

    // 2. Scan and credit 50 points
    const scanResult = await dbService.scanActivation(cleanToken, activationId)

    return NextResponse.json({
      success: true,
      message: 'Foto enviada para moderação e pontos creditados!',
      post,
      pointsEarned: 50,
      totalPoints: scanResult.user.totalPoints
    }, { status: 200 })

  } catch (error: any) {
    console.error('API POST instagram posts error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro ao processar postagem.' }, { status: 400 })
  }
}
