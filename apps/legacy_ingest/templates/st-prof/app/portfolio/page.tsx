'use client'

import { useState, useEffect } from 'react'
import { Star, Briefcase } from 'lucide-react'
import Image from 'next/image'

interface Project {
    id: string
    title: string
    description: string
    category: string
    images: string
    featured: boolean
    order: number
    createdAt: Date
}

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error loading projects:', err)
                setLoading(false)
            })
    }, [])

    const projectsWithImages = projects.map(project => ({
        ...project,
        imageUrls: project.images ? JSON.parse(project.images) : [],
    }))

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                            <Briefcase className="h-4 w-4 text-accent" />
                            <span className="text-sm font-semibold text-accent">Nossos Trabalhos</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-primary">
                            Portfólio
                        </h1>

                        <p className="text-xl text-text-secondary leading-relaxed">
                            Conheça alguns dos projetos que realizamos com excelência e dedicação.
                            Cada trabalho reflete nosso compromisso com a qualidade.
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 md:py-24">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        </div>
                    ) : projectsWithImages.length === 0 ? (
                        <div className="max-w-2xl mx-auto text-center py-20">
                            <div className="w-20 h-20 bg-border-light rounded-full flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="h-10 w-10 text-text-muted" />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-4">
                                Portfólio em Construção
                            </h3>
                            <p className="text-lg text-text-secondary">
                                Em breve, novos projetos serão adicionados ao portfólio.
                                Acompanhe nossas redes sociais para ficar por dentro das novidades.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projectsWithImages.map((project) => (
                                <div
                                    key={project.id}
                                    className="group bg-background border-2 border-border rounded-2xl overflow-hidden hover:border-accent hover:shadow-xl transition-all"
                                >
                                    {/* Project Image */}
                                    {project.imageUrls.length > 0 ? (
                                        <div className="relative h-64 bg-border-light overflow-hidden">
                                            <Image
                                                src={project.imageUrls[0]}
                                                alt={project.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {project.featured && (
                                                <div className="absolute top-4 right-4 bg-accent text-background px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    Destaque
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                                            <Briefcase className="h-16 w-16 text-primary/30" />
                                            {project.featured && (
                                                <div className="absolute top-4 right-4 bg-accent text-background px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    Destaque
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Project Info */}
                                    <div className="p-6 space-y-3">
                                        <div className="text-sm text-accent font-semibold uppercase tracking-wide">
                                            {project.category}
                                        </div>
                                        <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-text-secondary line-clamp-3 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
