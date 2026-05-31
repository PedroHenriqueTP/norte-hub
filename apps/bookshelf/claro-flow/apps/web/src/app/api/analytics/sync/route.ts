import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    error: 'Endpoint descontinuado. A sincronização de pontuação agora é feita por scanner de ativações em /api/activations/scan.' 
  }, { status: 410 })
}
