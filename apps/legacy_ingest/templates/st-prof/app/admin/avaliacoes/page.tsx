import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Star, Check, X } from 'lucide-react'

export default async function AdminReviewsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const reviews = await prisma.review.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: [
            { approved: 'asc' },
            { createdAt: 'desc' },
        ],
    })

    const pendingReviews = reviews.filter(r => !r.approved)
    const approvedReviews = reviews.filter(r => r.approved)

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating ? 'fill-warning text-warning' : 'text-border'
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-border-light">
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Gerenciar Avaliações</h1>
                    <p className="text-text-secondary">
                        {pendingReviews.length} pendentes • {approvedReviews.length} aprovadas
                    </p>
                </div>

                {/* Pending Reviews */}
                {pendingReviews.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-primary mb-4">
                            Aguardando Moderação ({pendingReviews.length})
                        </h2>
                        <div className="space-y-4">
                            {pendingReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-warning/5 border-2 border-warning rounded-lg p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="font-semibold text-primary text-lg mb-1">
                                                {review.user.name}
                                            </div>
                                            <div className="text-sm text-text-secondary mb-2">
                                                {review.user.email}
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-success text-white font-medium rounded-lg hover:bg-success/90 transition-colors inline-flex items-center gap-2">
                                                <Check className="h-4 w-4" />
                                                Aprovar
                                            </button>
                                            <button className="px-4 py-2 bg-error text-white font-medium rounded-lg hover:bg-error/90 transition-colors inline-flex items-center gap-2">
                                                <X className="h-4 w-4" />
                                                Rejeitar
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-text-primary leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                    <div className="text-xs text-text-muted mt-3">
                                        {new Date(review.createdAt).toLocaleString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Approved Reviews */}
                <div>
                    <h2 className="text-xl font-semibold text-primary mb-4">
                        Avaliações Aprovadas ({approvedReviews.length})
                    </h2>
                    {approvedReviews.length === 0 ? (
                        <div className="bg-background border border-border rounded-lg p-12 text-center">
                            <p className="text-text-secondary">Nenhuma avaliação aprovada ainda</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {approvedReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-background border border-border rounded-lg p-6"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="font-semibold text-primary mb-1">
                                                {review.user.name}
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <button className="text-error hover:text-error/80 transition-colors">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-text-secondary text-sm line-clamp-3">
                                        "{review.comment}"
                                    </p>
                                    <div className="text-xs text-text-muted mt-3">
                                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
