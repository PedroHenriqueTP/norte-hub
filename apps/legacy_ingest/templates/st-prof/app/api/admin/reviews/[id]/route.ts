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

        const { approved } = await request.json()

        await prisma.review.update({
            where: { id: params.id },
            data: { approved },
        })

        return NextResponse.json(
            { success: true, message: approved ? 'Avaliação aprovada' : 'Avaliação rejeitada' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao atualizar avaliação' },
            { status: 500 }
        )
    }
}

export async function DELETE(
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

        await prisma.review.delete({
            where: { id: params.id },
        })

        return NextResponse.json(
            { success: true, message: 'Avaliação excluída' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao excluir avaliação:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao excluir avaliação' },
            { status: 500 }
        )
    }
}
