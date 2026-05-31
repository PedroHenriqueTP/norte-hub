import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: [
                { featured: 'desc' },
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json([], { status: 500 })
    }
}
