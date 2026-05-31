import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProfileSchema = z.object({
    name: z.string().min(2),
    phone: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Não autenticado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = updateProfileSchema.parse(body)

        // Atualizar usuário
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: validatedData.name,
                phone: validatedData.phone || null,
            },
        })

        return NextResponse.json(
            { success: true, message: 'Perfil atualizado com sucesso!' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao atualizar perfil' },
            { status: 500 }
        )
    }
}
