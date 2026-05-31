import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, source } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, email e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source || 'website',
      status: 'new',
    });

    return NextResponse.json(
      { message: 'Lead cadastrado com sucesso', lead },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro ao cadastrar lead:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Este email ou telefone já está cadastrado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao cadastrar lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    await connectDB();

    const leads = await Lead.find().sort({ createdAt: -1 });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar leads' },
      { status: 500 }
    );
  }
}

