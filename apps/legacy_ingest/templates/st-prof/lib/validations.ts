import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido').optional(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const contactSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    message: z.string().min(10, 'Mensagem muito curta'),
})

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Comentário muito curto'),
})

export const projectSchema = z.object({
    title: z.string().min(3, 'Título muito curto'),
    description: z.string().min(10, 'Descrição muito curta'),
    category: z.string().min(2, 'Categoria inválida'),
    images: z.array(z.string().url()).min(1, 'Adicione pelo menos uma imagem'),
    featured: z.boolean().default(false),
    order: z.number().default(0),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ProjectInput = z.infer<typeof projectSchema>
