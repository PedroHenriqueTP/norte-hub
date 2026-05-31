'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import Link from 'next/link'
import { UserPlus, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.message || 'Erro ao criar conta')
                return
            }

            router.push('/login?registered=true')
        } catch (error) {
            setError('Erro ao criar conta. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-6">
                        <UserPlus className="h-8 w-8 text-background" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-3">Criar Conta</h1>
                    <p className="text-text-secondary text-lg">Cadastre-se para ter acesso personalizado</p>
                </div>

                {/* Form Card */}
                <div className="bg-background border border-border rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-error/10 border-l-4 border-error rounded-lg">
                                <p className="text-error text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                                Nome Completo
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                id="name"
                                autoComplete="name"
                                className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-text-primary placeholder:text-text-muted"
                                placeholder="Seu nome completo"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-error flex items-center gap-1">
                                    <span className="text-lg">•</span> {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                                Email
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                id="email"
                                autoComplete="email"
                                className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-text-primary placeholder:text-text-muted"
                                placeholder="seu@email.com"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-error flex items-center gap-1">
                                    <span className="text-lg">•</span> {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-text-primary mb-2">
                                Telefone <span className="text-text-muted font-normal">(opcional)</span>
                            </label>
                            <input
                                {...register('phone')}
                                type="tel"
                                id="phone"
                                autoComplete="tel"
                                className="w-full px-4 py-3.5 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-text-primary placeholder:text-text-muted"
                                placeholder="(11) 99999-9999"
                            />
                            {errors.phone && (
                                <p className="mt-2 text-sm text-error flex items-center gap-1">
                                    <span className="text-lg">•</span> {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3.5 pr-12 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-text-primary placeholder:text-text-muted"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-error flex items-center gap-1">
                                    <span className="text-lg">•</span> {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-accent text-background font-semibold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    Criar Conta
                                    <UserPlus className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t border-border-light text-center">
                        <p className="text-text-secondary">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-accent hover:text-accent/80 font-semibold transition-colors">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-text-secondary hover:text-primary transition-colors text-sm">
                        ← Voltar para o site
                    </Link>
                </div>
            </div>
        </div>
    )
}
