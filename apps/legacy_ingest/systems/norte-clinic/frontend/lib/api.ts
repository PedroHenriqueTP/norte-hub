// frontend/lib/api.ts
import axios from 'axios';
import { toast } from 'sonner';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error('Sessão expirada. Redirecionando...');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } else if (error.response?.status >= 500) {
            toast.error('Erro no servidor. Tente novamente.');
        }
        return Promise.reject(error);
    }
);
