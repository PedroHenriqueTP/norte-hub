import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ success: true, data: [] }, { status: 200 })
}

export async function POST() {
  return NextResponse.json({ success: true, message: 'Ticket criado com sucesso' }, { status: 200 })
}

export async function PATCH() {
  return NextResponse.json({ success: true, message: 'Ticket atualizado com sucesso' }, { status: 200 })
}
