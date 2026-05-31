'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
// Using regular img tag for external images
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Portfolio } from '@/types'

export default function PortfolioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          const item = data.portfolios?.find((p: Portfolio) => p._id === params.id)
          setPortfolio(item || null)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">Trabalho não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              {portfolio.images && portfolio.images[0] && (
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={portfolio.images[0]}
                    alt={portfolio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="p-8">
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {portfolio.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {portfolio.title}
              </h1>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {portfolio.description}
              </p>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar size={18} className="mr-2" />
                {new Date(portfolio.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {portfolio.images && portfolio.images.length > 1 && (
            <div className="p-8 border-t">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mais Fotos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolio.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${portfolio.title} - Foto ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

