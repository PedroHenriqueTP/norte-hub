"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Ocorreu um erro ao tentar entrar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-subtle overflow-hidden items-center justify-center">
                <Image
                    src="/login-hero.png"
                    alt="Atendente servindo cliente"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-[0.9]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 group">
                            <span className="text-2xl font-bold tracking-tight text-main group-hover:text-primary transition-colors">Delivery<span className="text-primary">Platform</span></span>
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-main">Acessar Painel</h2>
                        <p className="mt-2 text-muted">Entre com suas credenciais de administrador.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-main mb-1.5">Email Corporativo</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                        placeholder="seu@restaurante.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-main">Senha</label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-main text-white py-3.5 rounded-xl font-bold text-lg hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Acessando...' : 'Entrar na Plataforma'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>

                        {/* Social Buttons */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Ou entre com</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <button type="button" className="h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            </button>
                            <button type="button" className="h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button type="button" className="h-12 border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5 text-black fill-current" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-2.93-.09-.52-.53-1.01-.54-1.63-.51-.62.03-1.25.13-1.87.16-.62.03-1.4-.24-2.18-.54-1.39-.54-2.39-2.36-2.58-4.14-.19-1.78.69-3.21 1.78-4.04 1.09-.83 2.53-.74 3.38-.17 1.25.8 2.37.5 3.34-.14.28-.19.58-.41.58-.41s.57.19.86.37c.88.54 1.55 1.59 1.84 2.57-2.39 1.22-1.92 4.49.52 5.56-.2.53-.54 1.18-.84 1.65-.54.85-1.12 1.63-1.87 2.23-.75.6-1.5.75-2.25.75zM12.01 4.38c.11 1.48-1.58 3.51-2.93 3.55-.88-.04-2.03-1.42-1.93-2.9.11-1.48 1.66-3.4 2.92-3.44.89-.04 1.83.67 1.94 2.79z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        Não tem uma conta ainda?{" "}
                        <Link href="/auth/signup" className="font-bold text-primary hover:text-primary-dark hover:underline underline-offset-4 transition-colors">
                            Cadastre seu restaurante
                        </Link>
                        <Link href="/" className="block text-xs text-gray-400 hover:text-gray-600 transition-colors">
                            ← Voltar para a página inicial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
