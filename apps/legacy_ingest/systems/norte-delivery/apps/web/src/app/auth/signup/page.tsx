"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Building, ArrowRight, ArrowLeft, Check, Loader2, CreditCard } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    // State
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        organizationName: "",
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCvc: ""
    });

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password) {
                setError("Preencha todos os campos para continuar.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.organizationName) {
                setError("Informe o nome do seu restaurante.");
                return;
            }
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvc) {
            setError("Preencha os dados de pagamento para iniciar o teste.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

            // 1. Register API Call
            const res = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erro ao criar conta.");
            }

            // 2. Auto Login
            const loginResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (loginResult?.error) {
                // Account created but login failed? Redirect to login manually
                router.push("/auth/signin?registered=true");
            } else {
                router.push("/dashboard");
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Side - Visual (Reused from Login but distinct) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-surface-subtle overflow-hidden items-center justify-center">
                <Image
                    src="/login-hero.png" // We can use the same or a placeholder 'register-hero.png'
                    alt="Restaurante premium"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-[0.8] scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-black/60 mix-blend-multiply"></div>


            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="mb-10">
                        <Link href="/" className="inline-block mb-8 group">
                            <span className="text-2xl font-bold tracking-tight text-main group-hover:text-primary transition-colors">Delivery<span className="text-primary">Platform</span></span>
                        </Link>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-primary' : 'text-gray-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-200'}`}>1</div>
                                <span className="hidden sm:inline">Conta</span>
                            </div>
                            <div className="h-0.5 w-6 sm:w-10 bg-gray-100"></div>
                            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-primary' : 'text-gray-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-200'}`}>2</div>
                                <span className="hidden sm:inline">Restaurante</span>
                            </div>
                            <div className="h-0.5 w-6 sm:w-10 bg-gray-100"></div>
                            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 3 ? 'text-primary' : 'text-gray-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-200'}`}>3</div>
                                <span className="hidden sm:inline">Pagamento</span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-main">{step === 1 ? "Crie sua conta" : step === 2 ? "Sobre o seu negócio" : "Teste Grátis"}</h2>
                        <p className="mt-2 text-muted">{step === 1 ? "Preencha seus dados de administrador." : step === 2 ? "Vamos configurar seu espaço digital." : "7 dias grátis, sem compromisso."}</p>
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">

                        {/* Step 1: User Info */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="Ex: Carlos Silva"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Email Corporativo</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="admin@restaurante.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Senha</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="Mínimo 8 caracteres"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Org Info */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Nome do Restaurante</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="organizationName"
                                            value={formData.organizationName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="Ex: Pizzaria do Luigi"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-muted mt-2 ml-1">Este nome será exibido para seus clientes e funcionários.</p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment Info */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-emerald-900 text-sm">Período de Teste: 7 Dias</h3>
                                        <p className="text-xs text-emerald-700 mt-1">Você não será cobrado agora. Cancele a qualquer momento.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Número do Cartão</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="0000 0000 0000 0000"
                                            maxLength={19}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-main mb-1.5">Validade</label>
                                        <input
                                            name="cardExpiry"
                                            value={formData.cardExpiry}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-main mb-1.5">CVC</label>
                                        <input
                                            name="cardCvc"
                                            value={formData.cardCvc}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                            placeholder="123"
                                            maxLength={4}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-main mb-1.5">Nome no Cartão</label>
                                    <input
                                        name="cardName"
                                        value={formData.cardName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                                        placeholder="Como está no cartão"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3.5 rounded-xl font-bold text-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-main text-white py-3.5 rounded-xl font-bold text-lg hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                                    </>
                                ) : step < 3 ? (
                                    <>
                                        Continuar <ArrowRight className="w-5 h-5" />
                                    </>
                                ) : (
                                    <>
                                        Começar Teste Grátis <Check className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-muted mt-8">
                        Já tem uma conta?{" "}
                        <Link href="/auth/signin" className="font-semibold text-primary hover:underline underline-offset-4">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
