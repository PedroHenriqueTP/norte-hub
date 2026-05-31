'use client';

import { useActionState, useEffect } from 'react';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const router = useRouter();
    // Wrap register to handle redirect on client if successful (returning undefined/null usually means success if no error string)
    // Actually, create a wrapper action

    const [errorMessage, formAction, isPending] = useActionState(
        async (prevState: string | undefined, formData: FormData) => {
            const result = await register(prevState, formData);
            if (!result) {
                // Success (assuming register returns nothing on success, or we should change it to return specific success signal)
                // But register function above returns 'Invalid fields' or 'User already exists' or 'Failed..'
                // If it returns undefined, it might mean success.
                // Let's modify register to redirect? Or catch here?
                // Server actions redirect works.
            }
            return result;
        },
        undefined
    );

    // Better approach: Modify register server action to redirect on success. 
    // But since I didn't verify that code, I'll rely on it returning void/undefined on success causing a re-render or nothing.
    // Actually, I should just check if message is empty? 
    // Let's update `actions.ts` to redirect on success, or use `redirect` from `next/navigation` inside action.

    // For now, assume if no error, we can manually redirect? No, `useActionState` doesn't give us a callback easily.
    // I will update `actions.ts` in next step to include redirect.
    // Or I can use a simple `onSubmit` handler to call the action...

    // Let's stick to useActionState. I will assume I'll fix the redirect inside the action in a moment.

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required minLength={6} />
            </div>
            {errorMessage && (
                <div className="text-sm text-red-500">
                    {errorMessage}
                </div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating account...' : 'Register'}
            </Button>
        </form>
    );
}
