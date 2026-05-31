import { prisma } from '@/lib/prisma'
import { Star, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function ReviewsPage() {
    // Buscar avaliações aprovadas do banco de dados
    const reviews = await prisma.review.findMany({
        where: {
            approved: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    // Calcular rating médio
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0

    // Função para renderizar estrelas
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating
                                ? 'fill-warning text-warning'
                                : 'text-border'
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="section bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                            Avaliações
                        </h1>
                        <p className="text-lg text-text-secondary mb-6">
                            Veja o que nossos clientes dizem sobre nosso trabalho.
                        </p>

                        {/* Average Rating */}
                        {reviews.length > 0 && (
                            <div className="inline-flex flex-col items-center gap-2 bg-background border border-border rounded-lg px-8 py-4">
                                <div className="flex items-center gap-2">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <div className="text-3xl font-bold text-primary">
                                    {averageRating.toFixed(1)}
                                </div>
                                <div className="text-sm text-text-secondary">
                                    Baseado em {reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="section">
                <div className="container">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-text-secondary text-lg mb-6">
                                Seja o primeiro a avaliar nosso trabalho!
                            </p>
                            <Link
                                href={`https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Deixar Avaliação no Google
                                <ExternalLink className="h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                                    >
                                        {/* Rating */}
                                        <div className="mb-4">
                                            {renderStars(review.rating)}
                                        </div>

                                        {/* Comment */}
                                        <p className="text-text-primary mb-4 line-clamp-4">
                                            "{review.comment}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-semibold">
                                                {review.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-primary">
                                                    {review.user.name}
                                                </div>
                                                <div className="text-sm text-text-secondary">
                                                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Google Link */}
                                        {review.googleLink && (
                                            <Link
                                                href={review.googleLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 text-sm text-accent hover:underline inline-flex items-center gap-1"
                                            >
                                                Ver no Google
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* CTA to leave review */}
                            <div className="text-center">
                                <p className="text-text-secondary mb-4">
                                    Já trabalhou conosco? Compartilhe sua experiência!
                                </p>
                                <Link
                                    href={`https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Deixar Avaliação no Google
                                    <ExternalLink className="h-5 w-5" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
