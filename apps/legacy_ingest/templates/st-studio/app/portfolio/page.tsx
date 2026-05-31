'use client'

import { useEffect, useState } from 'react'
// Using regular img tag for external images
import Link from 'next/link'
import type { Portfolio } from '@/types'

const categories = ['todos', 'unhas', 'tatuagem', 'cabelo', 'maquiagem', 'outros']

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([])
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setPortfolios(data.portfolios || [])
        setFilteredPortfolios(data.portfolios || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedCategory === 'todos') {
      setFilteredPortfolios(portfolios)
    } else {
      setFilteredPortfolios(portfolios.filter((p) => p.category === selectedCategory))
    }
  }, [selectedCategory, portfolios])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Portfólio
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossos trabalhos realizados e inspire-se
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum trabalho encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((item) => (
              <Link
                key={item._id}
                href={`/portfolio/${item._id}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition bg-white"
              >
                {item.images && item.images[0] && (
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                        <p className="text-sm text-white/90 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <span className="inline-block bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
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
      </div>
    </div>
  )
}

