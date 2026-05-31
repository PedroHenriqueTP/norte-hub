import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar dados
        const validatedData = registerSchema.parse(body)

        // Verificar se email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'Email já cadastrado' },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(validatedData.password, 10)

        // Criar usuário
        await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                password: hashedPassword,
                role: 'CLIENT',
            },
        })

        return NextResponse.json(
            { success: true, message: 'Conta criada com sucesso!' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Erro ao criar usuário:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao criar conta' },
            { status: 500 }
        )
    }
}
