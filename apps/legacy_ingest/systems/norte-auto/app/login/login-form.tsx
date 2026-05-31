'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInSocial } from '@/lib/actions'; // We will create this
import { Facebook, Twitter, Smartphone } from 'lucide-react'; // Smartphone as placeholder for Apple if not available? Lucide doesn't have Apple logo usually.
// Lucide doesn't have brand icons for Apple/Google. We can use SVGs or text.

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" {...props}>
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.56-2.05-.48-3.21.02-1.05.45-2.08.33-3.05-.62-2.12-2.09-2.64-5.32-1.09-8.08 1.05-1.89 2.84-2.28 3.92-2.25 1.13 0 2.13.78 2.8.78.66 0 1.95-.91 3.52-.78 1.48.09 2.61.97 3.3 2.02-3.05 1.88-2.52 6.03.62 7.39-.42.94-.97 1.88-1.71 2.76-.75.78-1.39 1.62-2.02 1.38zM14.6 4.16c.72-1.25 2.12-1.88 3.36-1.92.59 1.5-1.02 3.19-3.36 1.92z" />
        </svg>
    )
}

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <form action={async () => { await signInSocial('google'); }}>
                    <Button variant="outline" className="w-full justify-start gap-2" type="submit">
                        <GoogleIcon className="h-5 w-5" />
                        Google
                    </Button>
                </form>
                <form action={async () => { await signInSocial('facebook'); }}>
                    <Button variant="outline" className="w-full justify-start gap-2" type="submit">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        Facebook
                    </Button>
                </form>
                <form action={async () => { await signInSocial('twitter'); }}>
                    <Button variant="outline" className="w-full justify-start gap-2" type="submit">
                        <Twitter className="h-5 w-5 text-black" />
                        X
                    </Button>
                </form>
                <form action={async () => { await signInSocial('apple'); }}>
                    <Button variant="outline" className="w-full justify-start gap-2" type="submit">
                        <AppleIcon className="h-5 w-5" />
                        Apple
                    </Button>
                </form>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
                </div>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" name="password" required />
                </div>
                {errorMessage && (
                    <div className="text-sm text-red-500" aria-live="polite">
                        {errorMessage}
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>
        </div>
    );
}
