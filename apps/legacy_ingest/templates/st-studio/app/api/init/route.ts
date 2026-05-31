import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    // Verificar se já existe admin
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin já existe' },
        { status: 200 }
      );
    }

    // Criar admin padrão
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'admin123',
      10
    );

    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@studio.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    });

    return NextResponse.json(
      { message: 'Admin criado com sucesso', admin: { email: admin.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao inicializar admin:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar admin' },
      { status: 500 }
    );
  }
}

