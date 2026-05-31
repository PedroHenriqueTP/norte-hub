'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transforme sua Beleza em Arte
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Especialistas em nail design, tatuagens e serviços de cabeleireiro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/servicos"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center"
            >
              Ver Serviços
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/contato"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

