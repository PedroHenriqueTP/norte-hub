"use client";

import React, { useState } from "react";
import { ArrowRight, BrainCircuit, Activity, Store, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula a injeção de Lead no Neon DB via Enterprise Hub
    setTimeout(() => {
      toast.success("Bem-vindo ao Ecossistema!", {
        description: "Seu Lead foi capturado pelo The Architect. Redirecionando para o Onboarding Simbionte...",
        icon: <BrainCircuit className="text-violet-500" />
      });
      setIsSubmitting(false);
      
      // Redireciona para o Onboarding da I.A.
      setTimeout(() => router.push("/admin/onboarding"), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      
      {/* HEADER */}
      <header className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm bg-slate-950/50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">N</div>
          <span className="font-black tracking-widest uppercase text-lg text-white">Norte Hub</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => router.push("/login")}>Entrar</Button>
          <Button className="bg-white text-black hover:bg-slate-200" onClick={() => router.push("/apps")}>Conectar Contas</Button>
        </div>
      </header>

      {/* HERO SECTION (Conversion-First) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-slate-950 to-slate-950 -z-10"></div>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            14 Hubs Conectados Simultaneamente
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
            Seu Sistema Nervoso <br className="hidden md:block"/> Corporativo e Biológico.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
            Gerencie sua empresa, sua saúde e suas finanças em um único ecossistema movido por Inteligência Artificial. Assuma o controle total.
          </p>
          
          <form onSubmit={handleLeadCapture} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
            <input 
              type="email" 
              required
              placeholder="Digite seu melhor email"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-auto py-3 px-6 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center"
            >
              {isSubmitting ? "Orquestrando..." : <>Começar Agora <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>

          {/* Social Proof Widget (Oráculo Mock) */}
          <div className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px]">👩‍💻</div>
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950 flex items-center justify-center text-[10px]">📈</div>
              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-950 flex items-center justify-center text-[10px]">🏋️</div>
            </div>
            <p>Mais de <span className="text-white font-bold">12.450</span> eventos processados hoje pela I.A.</p>
          </div>
        </div>
      </section>

      {/* GRID DE TENTÁCULOS (Ecosystem Showcase) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16 animate-in fade-in duration-1000 delay-300">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Um Ecossistema, Infinitas Soluções</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Do tráfego pago ao seu treino diário. Os dados fluem de forma amorfa, garantindo cashback e dopamina em cada iteração.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Intelligence */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <BrainCircuit className="text-violet-500 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">The Architect (I.A. Core)</h3>
            <p className="text-slate-400 text-sm">Sua Secretária Pessoal. Delega tarefas, agenda compromissos e cancela reuniões se seu nível de estresse estiver alto.</p>
          </div>
          
          {/* Card 2: Marketplace & Gastro */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-orange-500/50 transition-all group">
            <Store className="text-orange-500 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">Marketplace & Gastro Hub</h3>
            <p className="text-slate-400 text-sm">Venda infoprodutos, suplementos e refeições. Cada compra gera Cashback automático usando a Fintech Norte.</p>
          </div>

          {/* Card 3: Performance */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <Activity className="text-emerald-500 mb-6" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">Performance & Wellness</h3>
            <p className="text-slate-400 text-sm">Integração nativa com Apple Health e Garmin. Gamifique seu treino e transforme suor em dinheiro para o seu negócio.</p>
          </div>
          
          {/* Outros cards estéticos menores */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center gap-4">
            <PlayCircle className="text-blue-500" size={24} />
            <div>
              <h4 className="font-bold text-white text-sm">Norte Stream</h4>
              <p className="text-xs text-slate-500">O TikTok Educacional</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center gap-4">
            <ShieldCheck className="text-cyan-500" size={24} />
            <div>
              <h4 className="font-bold text-white text-sm">Soberania de Dados</h4>
              <p className="text-xs text-slate-500">Seus dados no Neon Cloud</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center gap-4">
            <Zap className="text-yellow-500" size={24} />
            <div>
              <h4 className="font-bold text-white text-sm">SMM & Ads Commander</h4>
              <p className="text-xs text-slate-500">Marketing Autônomo</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
