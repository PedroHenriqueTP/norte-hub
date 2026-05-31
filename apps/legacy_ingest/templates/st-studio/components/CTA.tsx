'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="bg-primary-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para Transformar sua Beleza?
        </h2>
        <p className="text-xl mb-8 text-primary-100">
          Entre em contato e agende sua consulta hoje mesmo
        </p>
        <Link
          href="/contato"
          className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center mx-auto"
        >
          Fale Conosco
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>
    </section>
  )
}

