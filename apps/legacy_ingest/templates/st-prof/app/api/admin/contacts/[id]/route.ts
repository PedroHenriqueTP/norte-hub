import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            )
        }

        const { status } = await request.json()

        await prisma.contactForm.update({
            where: { id: params.id },
            data: { status },
        })

        return NextResponse.json(
            { success: true, message: 'Status atualizado' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao atualizar contato:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao atualizar contato' },
            { status: 500 }
        )
    }
}
