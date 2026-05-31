"use client";

import React, { useState } from "react";
import { Grid, Lock, CheckCircle2, Bot, CalendarDays, Activity, Store, UtensilsCrossed, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONNECTORS = [
  {
    id: "gastro",
    name: "Norte Gastro Sync",
    description: "Sincroniza seus dados de consumo alimentar e macros diretamente com seu smartwatch e o restaurante da marca.",
    icon: <UtensilsCrossed size={32} className="text-orange-500" />,
    status: "available"
  },
  {
    id: "calendar",
    name: "Google Calendar Sync",
    description: "Conecta The Architect (Secretária I.A.) à sua agenda para triagem e agendamento proativo.",
    icon: <CalendarDays size={32} className="text-blue-500" />,
    status: "connected"
  },
  {
    id: "fitness",
    name: "Apple Health & Garmin",
    description: "Espelha seu batimento cardíaco e calorias queimadas para sugerir suplementação no Marketplace.",
    icon: <Activity size={32} className="text-red-500" />,
    status: "available"
  },
  {
    id: "marketplace",
    name: "Norte Store (Marketplace)",
    description: "Vincule suas compras físicas à sua Carteira Digital para usar Cashback inter-hubs.",
    icon: <Store size={32} className="text-violet-500" />,
    status: "available"
  },
  {
    id: "infohub",
    name: "InfoHub (Cursos & DRM)",
    description: "Sua área de membros nativa. Acesse o conteúdo tokenizado direto pela sua conta Google ou Apple.",
    icon: <MonitorPlay size={32} className="text-emerald-500" />,
    status: "available"
  },
  {
    id: "ai",
    name: "The Architect (I.A. Core)",
    description: "A Inteligência que orquestra tudo. Requer acesso ao Gmail e WhatsApp para despachar agentes.",
    icon: <Bot size={32} className="text-slate-300" />,
    status: "connected"
  }
];

export default function AppsPortalPage() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      // Abre o modal de OAuth (Mockado)
      alert("Redirecionando para Provider SSO (Google/Apple/etc)...");
      setConnecting(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#202123] text-slate-900 dark:text-slate-100 font-sans selection:bg-violet-500/30">
      
      {/* HEADER ESTILO OPENAI */}
      <header className="border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#343541] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-sm flex items-center justify-center">
              <Grid className="text-white dark:text-black" size={20} />
            </div>
            <span className="font-semibold tracking-tight text-lg">Norte Apps</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-slate-500 dark:text-slate-400 hidden md:block">
              Soberania de Dados Ativa
            </span>
            <Lock size={16} className="text-emerald-500" />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Conecte sua vida ao Ecossistema.</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            O Polvo Norte é mais poderoso quando integrado. Pareie suas contas do Google, Apple e Garmin para ativar a Secretária I.A. e o Bio-Hacking Simbionte.
          </p>
        </div>

        {/* GRID DE CARDS ESTILO CHATGPT PLUGINS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONNECTORS.map((connector) => (
            <div 
              key={connector.id}
              className="bg-white dark:bg-[#343541] rounded-xl border border-black/10 dark:border-white/10 p-6 flex flex-col hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-50 dark:bg-[#2A2B32] p-3 rounded-xl border border-black/5 dark:border-white/5">
                  {connector.icon}
                </div>
                {connector.status === "connected" && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-1 rounded">
                    <CheckCircle2 size={12} /> Conectado
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{connector.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
                {connector.description}
              </p>

              <Button 
                variant={connector.status === "connected" ? "outline" : "default"}
                className={`w-full font-medium rounded-lg h-10 ${
                  connector.status === "connected" 
                  ? "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" 
                  : "bg-black hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200"
                }`}
                onClick={() => handleConnect(connector.id)}
                disabled={connecting === connector.id}
              >
                {connecting === connector.id ? "Redirecionando..." : connector.status === "connected" ? "Gerenciar Acesso" : "Conectar Conta"}
              </Button>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
