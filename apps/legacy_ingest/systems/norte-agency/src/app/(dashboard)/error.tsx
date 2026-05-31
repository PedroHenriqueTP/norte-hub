"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Copy } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6 text-center p-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 animate-pulse">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Algo deu errado!
                </h2>
                <p className="text-slate-500">
                    Encontramos um erro inesperado ao processar sua solicitação.
                    Nossos sistemas já foram notificados.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-slate-100 p-4 rounded-md text-left text-xs font-mono text-red-500 overflow-auto max-h-32 w-full mt-4 border border-slate-200">
                        {error.message}
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-8"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Tentar Novamente
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        navigator.clipboard.writeText(error.message + "\n\n" + error.stack);
                        alert("Erro copiado para a área de transferência!");
                    }}
                    className="px-8 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar Erro
                </Button>
            </div>
        </div>
    );
}
