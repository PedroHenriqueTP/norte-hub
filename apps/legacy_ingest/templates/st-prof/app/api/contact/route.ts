import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validar dados
        const validatedData = contactSchema.parse(body)

        // Salvar no banco de dados
        await prisma.contactForm.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                phone: validatedData.phone,
                message: validatedData.message,
                status: 'new',
            },
        })

        return NextResponse.json(
            { success: true, message: 'Formulário enviado com sucesso!' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao processar formulário:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao processar formulário' },
            { status: 500 }
        )
    }
}
