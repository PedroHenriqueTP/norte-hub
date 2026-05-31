"use client";

import React, { useState, useEffect } from "react";
import { BrainCircuit, Check, ShieldCheck, Dumbbell, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NorteOnboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  // Sequência de falas da I.A. Simulada
  useEffect(() => {
    if (step === 0) {
      setTimeout(() => setStep(1), 1500);
    }
  }, [step]);

  const completeOnboarding = () => {
    toast("🎁 Onboarding Concluído!", {
      description: "Você recebeu seus primeiros R$ 50 em Cashback para usar no Ecossistema.",
      icon: <Wallet className="text-emerald-500" />
    });
    setTimeout(() => router.push("/admin/feed"), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 p-6">
      
      {/* MENSAGENS DA I.A. */}
      <div className="flex flex-col gap-4">
        
        {/* Step 0: Saudação Inicial */}
        <div className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 shadow-md">
            <p className="text-white">Olá! Eu sou <strong>The Architect</strong>, a Inteligência Artificial do Norte Hub.</p>
            <p className="text-slate-400 text-sm mt-1">Estou aqui para fundir sua biologia com seus negócios. Vamos configurar seu perfil?</p>
          </div>
        </div>

        {/* Step 1: Permissões de Dados (Soberania) */}
        {step >= 1 && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 mt-2">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 w-full shadow-md">
              <p className="text-white mb-4">Primeiro, preciso de acesso aos seus dados de saúde para otimizar sua rotina.</p>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => setStep(2)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white w-full justify-start"
                >
                  <ShieldCheck className="mr-2" size={16} /> Conectar Apple Health / Garmin
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  Pular por enquanto
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Objetivo Principal */}
        {step >= 2 && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 mt-2">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 w-full shadow-md">
              <p className="text-white mb-4">Perfeito. Qual é o seu foco principal no momento?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => setStep(3)} variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-slate-900 border-slate-700 hover:border-orange-500 hover:bg-orange-500/10">
                  <Dumbbell className="text-orange-500" />
                  <span className="text-xs text-white whitespace-normal">Performance Física</span>
                </Button>
                <Button onClick={() => setStep(3)} variant="outline" className="h-auto py-3 flex flex-col gap-2 bg-slate-900 border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10">
                  <Wallet className="text-emerald-500" />
                  <span className="text-xs text-white whitespace-normal">Escala Corporativa (Vendas)</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Conclusão & Reward */}
        {step >= 3 && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 mt-2">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)] w-full">
              <p className="text-emerald-400 font-bold flex items-center gap-2 mb-2">
                <Check size={16} /> Configuração Concluída!
              </p>
              <p className="text-white text-sm mb-4">
                Seu perfil base foi montado. Acabei de injetar <strong>R$ 50,00</strong> na sua Carteira Digital para você testar o ecossistema.
              </p>
              <Button onClick={completeOnboarding} className="w-full bg-white text-black hover:bg-slate-200">
                Acessar meu Feed (Norte Stream)
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
