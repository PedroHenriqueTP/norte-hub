'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Vehicle Schema
const vehicleSchema = z.object({
    brand: z.string().min(1, "Marca é obrigatória"),
    model: z.string().min(1, "Modelo é obrigatório"),
    version: z.string().optional(),
    year_manufacture: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    year_model: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price_sell: z.coerce.number().min(1, "Preço deve ser maior que zero"),
    mileage: z.coerce.number().min(0),
    fuel_type: z.string().min(1),
    transmission: z.string().min(1),
    color: z.string().min(1),
    description: z.string().optional(),
    photos: z.array(z.string()).optional(), // URLs
})

export async function createVehicle(formData: FormData) {
    const supabase = await createClient()

    // 1. Get User/Org for security (Standard RLS will enforce, but we need Org ID for insert)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Get Organization ID of the user (assuming single org for MVP)
    const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!org) {
        return { error: 'Organization not found' }
    }

    // 2. Parse Data
    const rawData = {
        brand: formData.get('brand'),
        model: formData.get('model'),
        version: formData.get('version'),
        year_manufacture: formData.get('year_manufacture'),
        year_model: formData.get('year_model'),
        price_sell: formData.get('price_sell'),
        mileage: formData.get('mileage'),
        fuel_type: formData.get('fuel_type'),
        transmission: formData.get('transmission'),
        color: formData.get('color'),
        description: formData.get('description'),
        organization_id: org.id
    }

    const validated = vehicleSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: 'Dados inválidos. Verifique os campos.' }
    }

    // 3. Insert into DB
    const { error } = await supabase
        .from('vehicles')
        .insert({
            ...validated.data,
            organization_id: org.id,
            status: 'disponivel'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/app/dashboard/vehicles')
    revalidatePath('/app/dashboard') // Update stats
    redirect('/app/dashboard/vehicles')
}
