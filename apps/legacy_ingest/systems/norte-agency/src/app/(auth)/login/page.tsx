
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            alert("Credenciais inválidas. Tente novamente.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden">
            {/* LEFT SIDE: Cinematic / Brand */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden lg:flex w-[60%] relative flex-col justify-between p-16 overflow-hidden"
            >
                {/* Background Image with Parallax-like feel */}
                <div className="absolute inset-0 bg-zinc-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Brand Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl shadow-lg shadow-white/10">A</div>
                    <span className="text-2xl font-bold tracking-tight text-white">AgencyOS</span>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 max-w-2xl space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl font-bold tracking-tighter leading-tight"
                    >
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                            Agency Workflow
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-zinc-400 font-light"
                    >
                        A plataforma definitiva para escalar operações criativas, financeiras e de talentos.
                    </motion.p>
                </div>

                {/* Footer / Social Proof */}
                <div className="relative z-10 flex items-center gap-6 text-sm text-zinc-500 font-medium">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-500" />
                        <span>Gestão Financeira</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-500" />
                        <span>Talent Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-violet-500" />
                        <span>Automação de Jobs</span>
                    </div>
                </div>
            </motion.div>

            {/* RIGHT SIDE: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative bg-zinc-950/50 backdrop-blur-sm">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center space-y-2 lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Bem-vindo de volta</h2>
                        <p className="text-zinc-400">Acesse seu workspace para continuar.</p>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Email Corporativo</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="voce@agencia.com"
                                    required
                                    className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Senha</Label>
                                    <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Esqueceu?</a>
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-12 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all rounded-lg"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Entrar no Sistema <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-zinc-600 text-sm">
                        Ainda não tem acesso?{" "}
                        <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors underline underline-offset-4">
                            Falar com Suporte
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

