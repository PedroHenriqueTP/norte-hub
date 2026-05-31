'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'

const profileSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    phone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
})

type ProfileInput = z.infer<typeof profileSchema>

interface ProfileFormProps {
    user: {
        id: string
        name: string
        email: string
        phone: string | null
    }
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
            phone: user.phone || '',
        },
    })

    const onSubmit = async (data: ProfileInput) => {
        setIsLoading(true)
        setError('')
        setSuccess(false)

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Erro ao atualizar perfil')
            }

            setSuccess(true)
            router.refresh()

            // Limpar mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            setError('Erro ao atualizar perfil. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && (
                <div className="p-4 bg-success/10 border border-success rounded-lg text-success text-sm">
                    Perfil atualizado com sucesso!
                </div>
            )}

            {error && (
                <div className="p-4 bg-error/10 border border-error rounded-lg text-error text-sm">
                    {error}
                </div>
            )}

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Nome Completo
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                )}
            </div>

            {/* Email (read-only) */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-border rounded-lg bg-border-light text-text-muted cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-text-muted">
                    O email não pode ser alterado
                </p>
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                    Telefone
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

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    'Salvando...'
                ) : (
                    <>
                        Salvar Alterações
                        <Save className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    )
}
