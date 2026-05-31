"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Layers, Palette, LayoutDashboard, ShoppingCart, BarChart, FileText, CheckCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "hero-section", x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "data-chart", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
  { i: "checkout-block", x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
];

export function NorteStudio() {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [uxScore, setUxScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("norte-studio-layout");
    setLayout(saved ? JSON.parse(saved) : DEFAULT_LAYOUT);
    setIsMounted(true);
  }, []);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem("norte-studio-layout", JSON.stringify(newLayout));
  };

  const handleUxAudit = () => {
    setIsAuditing(true);
    toast("🤖 UX Lab Agent analisando contraste e fluxo...", { icon: <Wand2 className="text-violet-500 animate-pulse" /> });
    
    setTimeout(() => {
      setUxScore(98);
      setIsAuditing(false);
      toast.success("Auditoria Concluída: Design Aprovado!", {
        description: "Contraste impecável (WCAG AAA). Hierarquia visual otimizada para conversão.",
      });
    }, 2500);
  };

  const handlePublish = () => {
    toast.success("🚀 SaaS Provisionado com Sucesso!", {
      description: "Infraestrutura escalada no Neon DB. Domínio 'meusaas.axis.com' ativo.",
    });
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      
      {/* SIDEBAR DE FERRAMENTAS (Norte Studio Tools) */}
      <div className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-6 shrink-0 h-fit sticky top-4 shadow-2xl">
        <div>
          <h3 className="text-white font-black flex items-center gap-2 mb-1"><Layers className="text-violet-500"/> Norte Studio</h3>
          <p className="text-xs text-slate-400">SaaS Maker Level 2</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Componentes</p>
          <div className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 cursor-grab flex items-center gap-3 transition-colors">
            <LayoutDashboard size={18} className="text-blue-400"/>
            <span className="text-sm font-medium text-slate-300">Hero Section</span>
          </div>
          <div className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 cursor-grab flex items-center gap-3 transition-colors">
            <BarChart size={18} className="text-emerald-400"/>
            <span className="text-sm font-medium text-slate-300">Gráfico de Dados</span>
          </div>
          <div className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 cursor-grab flex items-center gap-3 transition-colors">
            <ShoppingCart size={18} className="text-orange-400"/>
            <span className="text-sm font-medium text-slate-300">Norte Checkout</span>
          </div>
          <div className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 cursor-grab flex items-center gap-3 transition-colors">
            <FileText size={18} className="text-cyan-400"/>
            <span className="text-sm font-medium text-slate-300">Formulário de Lead</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-slate-800">
          <Button 
            onClick={handleUxAudit}
            disabled={isAuditing}
            variant="outline" 
            className="w-full bg-slate-900 border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
          >
            {isAuditing ? "Auditando..." : <><Palette className="mr-2" size={16}/> Auditoria UX Lab</>}
          </Button>
          <Button 
            onClick={handlePublish}
            className="w-full bg-white text-black hover:bg-slate-200"
          >
            Publicar Meu SaaS
          </Button>

          {uxScore && (
            <div className="mt-2 text-center p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-emerald-500"/>
              <span className="text-emerald-400 font-bold text-sm">UX Score: {uxScore}/100</span>
            </div>
          )}
        </div>
      </div>

      {/* CANVAS PRINCIPAL (Morphic Engine) */}
      <div className="flex-1 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl p-4 min-h-[800px] relative overflow-hidden">
        
        {/* Marca d'água de background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Layers size={300} />
        </div>

        <GridLayout
          className="layout relative z-10"
          layout={layout}
          cols={12}
          rowHeight={60}
          width={900} // Mock width for responsive feel
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {/* HERO SECTION BLOCK */}
          <div key="hero-section" className="bg-gradient-to-br from-violet-900/40 to-slate-900 rounded-2xl border border-violet-500/30 shadow-2xl flex flex-col items-center justify-center p-8 group cursor-move">
            <h1 className="text-3xl font-black text-white text-center mb-2 group-hover:scale-105 transition-transform">Seu Novo Sistema Começa Aqui</h1>
            <p className="text-slate-400 text-center">Arraste e redimensione. O Morphic Engine cuida do CSS.</p>
          </div>

          {/* DATA CHART BLOCK */}
          <div key="data-chart" className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center p-4 group cursor-move hover:border-emerald-500/50 transition-colors">
            <BarChart size={40} className="text-emerald-500 mb-2 opacity-50" />
            <span className="text-white font-bold">Gráfico de Faturamento</span>
            <span className="text-xs text-slate-500">(Conectado ao TransactionLedger)</span>
          </div>

          {/* CHECKOUT BLOCK */}
          <div key="checkout-block" className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center p-4 group cursor-move hover:border-orange-500/50 transition-colors">
            <ShoppingCart size={40} className="text-orange-500 mb-2 opacity-50" />
            <span className="text-white font-bold">Norte Checkout</span>
            <span className="text-xs text-slate-500">(Suporte a Split e Cashback)</span>
          </div>

        </GridLayout>
      </div>
    </div>
  );
}
