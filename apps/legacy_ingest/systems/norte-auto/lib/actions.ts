'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciais inválidas.';
                default:
                    return 'Algo deu errado.';
            }
        }
        throw error;
    }
}

export async function signInSocial(provider: string) {
    await signIn(provider);
}

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return 'Campos inválidos.';
    }

    const { email, password, name } = validatedFields.data;

    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return 'Usuário já existe.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                plan: 'free',
            },
        });

    } catch (err) {
        console.error(err);
        return 'Falha ao registrar usuário.';
    }
}
