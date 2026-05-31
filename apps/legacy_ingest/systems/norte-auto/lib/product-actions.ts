'use server';

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import OpenAI from 'openai';
import { redirect } from "next/navigation";

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ProductSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    stock: z.coerce.number().int().min(0),
    sku: z.string().optional(),
});

// --- Product CRUD ---

export async function createProduct(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const parsed = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        sku: formData.get('sku'),
    });

    if (!parsed.success) return { error: "Invalid fields" };

    try {
        await db.product.create({
            data: {
                ...parsed.data,
                userId: session.user.id
            }
        });
    } catch (err) {
        return { error: "Failed to create product" };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const parsed = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        sku: formData.get('sku'),
    });

    if (!parsed.success) return { error: "Invalid fields" };

    try {
        await db.product.update({
            where: { id, userId: session.user.id }, // Enforce tenant isolation
            data: parsed.data
        });
    } catch {
        return { error: "Failed to update product" };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.product.delete({
            where: { id, userId: session.user.id }
        });
    } catch {
        return { error: "Failed to delete" };
    }
    revalidatePath('/dashboard/products');
}

export async function fetchProducts() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await db.product.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function fetchProductById(id: string) {
    const session = await auth();
    if (!session?.user?.id) return null;

    return await db.product.findUnique({
        where: { id, userId: session.user.id }
    });
}

// --- AI Generation ---

export async function generateAIContent(features: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 1. Check Limits (Mock logic, replace with Plan checks)
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) throw new Error("User not found");

    const limit = user.plan === 'pro' ? 100 : 5;
    if (user.aiUsageCount >= limit) {
        throw new Error("Limite de IA excedido para seu plano.");
    }

    // 2. Call OpenAI
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // or gpt-4
            messages: [
                {
                    role: "system",
                    content: "Você é um especialista em SEO para E-commerce. Crie uma descrição em HTML, usando bullets, persuasiva, focada em conversão para Marketplaces. Use palavras-chave relevantes."
                },
                {
                    role: "user",
                    content: `Características do produto: ${features}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const content = response.choices[0].message.content;

        // 3. Increment Usage
        await db.user.update({
            where: { id: user.id },
            data: { aiUsageCount: { increment: 1 } }
        });

        return content;

    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Falha ao gerar conteúdo.");
    }
}
