import { NextResponse } from 'next/server'
import { dbService } from '@/utils/db'

export async function POST(request: Request) {
  try {
    const { postId, status } = await request.json()
    if (!postId || !status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json({ success: false, error: 'Dados inválidos.' }, { status: 400 })
    }

    const post = await dbService.moderateInstagramPost(postId, status)
    return NextResponse.json({ success: true, post }, { status: 200 })
  } catch (error: any) {
    console.error('API POST instagram moderate error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Erro ao processar moderação.' }, { status: 400 })
  }
}
