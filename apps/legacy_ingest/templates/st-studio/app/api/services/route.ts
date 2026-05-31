import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: any = { active: true };
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query).sort({ category: 1, name: 1 });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar serviços' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    const { name, description, price, duration, category, active } = await request.json();

    if (!name || !description || price === undefined || !duration || !category) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    const service = await Service.create({
      name,
      description,
      price,
      duration,
      category,
      active: active !== undefined ? active : true,
    });

    return NextResponse.json(
      { message: 'Serviço criado com sucesso', service },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao criar serviço' },
      { status: 500 }
    );
  }
}

