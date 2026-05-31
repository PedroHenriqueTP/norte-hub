import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

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

        await prisma.project.delete({
            where: { id: params.id },
        })

        return NextResponse.json(
            { success: true, message: 'Projeto excluído com sucesso' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erro ao excluir projeto:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao excluir projeto' },
            { status: 500 }
        )
    }
}
