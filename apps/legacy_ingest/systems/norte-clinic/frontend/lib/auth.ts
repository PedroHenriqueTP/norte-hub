// frontend/lib/auth.ts
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
    const router = useRouter();
    return useMutation({
        mutationFn: async ({ username, password }: { username: string; password: string }) => {
            // Backend expects form-data for OAuth2PasswordRequestForm
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const res = await api.post('/api/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            localStorage.setItem('token', res.data.access_token);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Login realizado com sucesso!');
            router.push('/dashboard');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error('Falha no login. Verifique suas credenciais.');
        },
    });
}

export function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
