"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"; // Use Next.js router for client nav

export default function NotFound() {
    const router = useRouter();

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon / Illustration */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center bg-violet-100 rounded-full animate-pulse-slow">
                    <span className="text-6xl font-bold text-violet-600">404</span>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Ops! Página não encontrada.
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Parece que o link que você seguiu não existe mais ou foi movido.
                    </p>
                </div>

                {/* Search Bar (Optional but suggested) */}
                <div className="relative max-w-sm mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Tente buscar o que procura..."
                        className="pl-10 bg-white border-slate-200 shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                </div>

                {/* Buttons using the requested logic */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        onClick={goBack}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-8 py-6 text-base"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Voltar para a página anterior
                    </Button>

                    <Link href="/" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-base shadow-md hover:shadow-lg transition-all"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Ir para o Início
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer / Copyright optional */}
            <div className="mt-16 text-slate-400 text-sm">
                &copy; 2026 AgencyOS. Todos os direitos reservados.
            </div>
        </div>
    );
}
