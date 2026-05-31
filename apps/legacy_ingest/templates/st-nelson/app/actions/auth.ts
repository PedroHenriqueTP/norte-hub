'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validated = authSchema.safeParse(data)

    if (!validated.success) {
        return { error: 'Invalid input data' }
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/app/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const validated = authSchema.safeParse(data)

    if (!validated.success) {
        return { error: 'Invalid input data' }
    }

    const { data: authData, error: authError } = await supabase.auth.signUp(data)

    if (authError) {
        return { error: authError.message }
    }

    if (authData.user) {
        const fullName = formData.get('options[data][full_name]') as string
        const storeName = formData.get('options[data][store_name]') as string
        const storeSlug = formData.get('options[data][store_slug]') as string

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                email: data.email,
                full_name: fullName,
            })
            .select()

        if (!profileError || profileError.code === '23505') {
            const { error: orgError } = await supabase
                .from('organizations')
                .insert({
                    name: storeName,
                    slug: storeSlug,
                    owner_id: authData.user.id
                })

            if (orgError) {
                return { error: `Erro ao criar loja: ${orgError.message}` }
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/app/dashboard')
}
