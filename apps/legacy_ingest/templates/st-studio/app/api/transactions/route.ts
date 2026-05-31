import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    await connectDB();

    const transactions = await Transaction.find().sort({ date: -1 });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json(
      {
        transactions,
        summary: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    requireAuth(request);

    const { type, amount, description, category, date } = await request.json();

    if (!type || amount === undefined || !description || !category) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    const transaction = await Transaction.create({
      type,
      amount,
      description,
      category,
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(
      { message: 'Transação criada com sucesso', transaction },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Não autorizado') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
}

