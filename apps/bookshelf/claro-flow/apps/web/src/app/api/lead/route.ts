import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ 
    success: false, 
    error: 'Endpoint descontinuado. Use /api/checkin.' 
  }, { status: 410 })
}
