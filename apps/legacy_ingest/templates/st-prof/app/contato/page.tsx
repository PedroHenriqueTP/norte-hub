'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { getWhatsAppUrl, formatContactMessage } from '@/lib/whatsapp'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactInput) => {
        setIsSubmitting(true)

        try {
            // Salvar no banco de dados
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Erro ao enviar formulário')
            }

            // Redirecionar para WhatsApp
            const message = formatContactMessage(data)
            const whatsappUrl = getWhatsAppUrl(message)

            setIsSuccess(true)
            reset()

            // Abrir WhatsApp após 1 segundo
            setTimeout(() => {
                window.open(whatsappUrl, '_blank')
                setIsSuccess(false)
            }, 1000)
        } catch (error) {
            console.error('Erro:', error)
            alert('Erro ao enviar formulário. Por favor, tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="section bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                            Entre em Contato
                        </h1>
                        <p className="text-lg text-text-secondary">
                            Estamos prontos para atender você. Envie sua mensagem e retornaremos em breve.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-6">
                                Envie sua Mensagem
                            </h2>

                            {isSuccess && (
                                <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg flex items-center gap-3 text-success">
                                    <CheckCircle className="h-5 w-5" />
                                    <p>Mensagem enviada! Redirecionando para o WhatsApp...</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                                        Nome *
                                    </label>
                                    <input
                                        {...register('name')}
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                        placeholder="Seu nome completo"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                                        Email *
                                    </label>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        {...register('phone')}
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                        placeholder="(11) 99999-9999"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                                        Mensagem *
                                    </label>
                                    <textarea
                                        {...register('message')}
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                                        placeholder="Descreva como podemos ajudar você..."
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-sm text-error">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        'Enviando...'
                                    ) : (
                                        <>
                                            Enviar Mensagem
                                            <Send className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-6">
                                Informações de Contato
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Telefone</h3>
                                        <p className="text-text-secondary">(11) 99999-9999</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Email</h3>
                                        <p className="text-text-secondary">contato@profissional.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary mb-1">Localização</h3>
                                        <p className="text-text-secondary">São Paulo, SP</p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="mt-8 p-6 bg-border-light rounded-lg">
                                <h3 className="font-semibold text-primary mb-4">Horário de Atendimento</h3>
                                <div className="space-y-2 text-text-secondary">
                                    <div className="flex justify-between">
                                        <span>Segunda - Sexta:</span>
                                        <span className="font-medium">8h - 18h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sábado:</span>
                                        <span className="font-medium">9h - 13h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Domingo:</span>
                                        <span className="font-medium">Fechado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
