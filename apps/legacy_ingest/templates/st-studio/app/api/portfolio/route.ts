import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query = category ? { category } : {};

    const portfolios = await Portfolio.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ portfolios }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar portfólio:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar portfólio' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    const { title, description, category, images, featured } = await request.json();

    if (!title || !description || !category || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.create({
      title,
      description,
      category,
      images,
      featured: featured || false,
    });

    return NextResponse.json(
      { message: 'Item adicionado ao portfólio', portfolio },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao criar item do portfólio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar item do portfólio' },
      { status: 500 }
    );
  }
}

