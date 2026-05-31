import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Trash2, Star } from 'lucide-react'

export default async function AdminPortfolioPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const projects = await prisma.project.findMany({
        orderBy: [
            { featured: 'desc' },
            { order: 'asc' },
            { createdAt: 'desc' },
        ],
    })

    return (
        <div className="min-h-screen bg-border-light">
            <div className="container py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary mb-2">Gerenciar Portfólio</h1>
                        <p className="text-text-secondary">{projects.length} projetos cadastrados</p>
                    </div>
                    <Link
                        href="/admin/portfolio/novo"
                        className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Novo Projeto
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="bg-background border border-border rounded-lg p-12 text-center">
                        <p className="text-text-secondary mb-6">Nenhum projeto cadastrado ainda</p>
                        <Link
                            href="/admin/portfolio/novo"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Adicionar Primeiro Projeto
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-semibold text-primary">
                                                    {project.title}
                                                </h3>
                                                {project.featured && (
                                                    <Star className="h-4 w-4 text-warning fill-warning" />
                                                )}
                                            </div>
                                            <span className="text-sm text-accent font-medium">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/portfolio/${project.id}/editar`}
                                            className="flex-1 px-4 py-2 border border-border text-primary font-medium rounded-lg hover:bg-border-light transition-colors inline-flex items-center justify-center gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Editar
                                        </Link>
                                        <button
                                            className="px-4 py-2 border border-error text-error font-medium rounded-lg hover:bg-error/10 transition-colors inline-flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
