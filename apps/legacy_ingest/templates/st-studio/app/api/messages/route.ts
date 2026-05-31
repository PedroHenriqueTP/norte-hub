import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import Lead from '@/models/Lead';

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    const query = leadId ? { leadId } : {};

    const messages = await Message.find(query)
      .populate('leadId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao buscar mensagens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { from, to, content, type, direction, leadId } = await request.json();

    if (!from || !to || !content || !type || !direction) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    // Se for mensagem de WhatsApp e não tiver leadId, tentar encontrar ou criar lead
    let finalLeadId = leadId;
    if (type === 'whatsapp' && !leadId) {
      let lead = await Lead.findOne({ phone: from });
      if (!lead) {
        lead = await Lead.create({
          name: from,
          phone: from,
          email: '',
          source: 'whatsapp',
          status: 'new',
        });
      }
      finalLeadId = lead._id;
    }

    const message = await Message.create({
      from,
      to,
      content,
      type,
      direction,
      leadId: finalLeadId,
    });

    return NextResponse.json(
      { message: 'Mensagem salva com sucesso', data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar mensagem' },
      { status: 500 }
    );
  }
}

