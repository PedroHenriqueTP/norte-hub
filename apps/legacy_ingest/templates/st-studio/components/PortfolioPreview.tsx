'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
// Using regular img tag for external images
import type { Portfolio } from '@/types'

export default function PortfolioPreview() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setPortfolios(data.portfolios?.slice(0, 6) || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nosso Portfólio
            </h2>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nosso Portfólio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira alguns dos nossos trabalhos realizados
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum trabalho no portfólio ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item) => (
              <Link
                key={item._id}
                href={`/portfolio/${item._id}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition"
              >
                {item.images && item.images[0] && (
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
                        <span className="inline-block mt-2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Ver Portfólio Completo
          </Link>
        </div>
      </div>
    </section>
  )
}

