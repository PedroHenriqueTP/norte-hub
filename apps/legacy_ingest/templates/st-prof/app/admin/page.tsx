import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Users, MessageSquare, Star, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    // Buscar métricas
    const [totalClients, totalProjects, totalReviews, totalContacts] = await Promise.all([
        prisma.user.count({ where: { role: 'CLIENT' } }),
        prisma.project.count(),
        prisma.review.count(),
        prisma.contactForm.count(),
    ])

    const stats = [
        { title: 'Clientes', value: totalClients, icon: Users, color: 'bg-blue-500', href: '/admin/clientes' },
        { title: 'Projetos', value: totalProjects, icon: FileText, color: 'bg-green-500', href: '/admin/portfolio' },
        { title: 'Avaliações', value: totalReviews, icon: Star, color: 'bg-yellow-500', href: '/admin/avaliacoes' },
        { title: 'Contatos', value: totalContacts, icon: MessageSquare, color: 'bg-purple-500', href: '/admin/contatos' },
    ]

    return (
        <div className="min-h-screen bg-border-light">
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Painel Administrativo</h1>
                    <p className="text-text-secondary">Bem-vindo, {session.user.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <Link
                                key={stat.title}
                                href={stat.href}
                                className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                <div className="text-sm text-text-secondary">{stat.title}</div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
