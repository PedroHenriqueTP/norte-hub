"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BrainCircuit, Mail, Activity, Users, Save, GripHorizontal, Zap, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "timeline", x: 0, y: 0, w: 8, h: 5, minW: 6, minH: 4 },
  { i: "agents-status", x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
  { i: "delegation-ai", x: 0, y: 5, w: 12, h: 4, minW: 6, minH: 3 },
];

export function NorteCommandCenter() {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedLayout = localStorage.getItem('norte-command-center');
    setLayout(savedLayout ? JSON.parse(savedLayout) : DEFAULT_LAYOUT);
    setIsMounted(true);
  }, []);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem('norte-command-center', JSON.stringify(newLayout));
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BrainCircuit className="text-violet-500" size={24}/> The Architect (I.A. Command Center)
          </h2>
          <p className="text-sm text-slate-400 mt-1">Sua vida e suas agências, orquestradas autonomamente por Inteligência Artificial.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Secretária Online</span>
        </div>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-violet-500/30 rounded-2xl p-4 min-h-[600px]">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={1000} // Mock width
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {/* BLOCO 1: TIMELINE DE COMPROMISSOS UNIFICADA */}
          <div key="timeline" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-violet-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center justify-between text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Mail size={14} className="text-blue-400"/> Omni-Channel Sync</div>
                  <span className="text-[10px] text-slate-500">Hoje, 14:30</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-slate-800">
                  <div className="p-4 bg-violet-500/5 border-l-2 border-violet-500">
                    <p className="text-xs text-violet-400 font-bold mb-1">10:00 AM • Novo Email Recebido</p>
                    <p className="text-sm text-white">Pedido de orçamento para novo Marketplace (Cliente: Lojas RPM).</p>
                    <div className="mt-2 text-xs bg-slate-800 px-2 py-1 rounded inline-flex items-center gap-1 text-slate-300">
                      <Zap size={10} className="text-yellow-400"/> Ação Tomada: Apresentação ROI gerada pelo Agente.
                    </div>
                  </div>
                  <div className="p-4 hover:bg-slate-800/50 transition-colors">
                    <p className="text-xs text-slate-500 font-bold mb-1">12:30 PM • Reunião de Equipe (Cogitare)</p>
                    <p className="text-sm text-slate-300">Alinhamento de tráfego pago da semana.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BLOCO 2: STATUS DOS AGENTES */}
          <div key="agents-status" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-violet-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <Activity size={14} className="text-emerald-400"/> Agents Status
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Oráculo (Scraping)</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Varrendo B2B...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Agente de Vendas</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Disponível</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Bio-Hacking Concierge</span>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Monitorando Watch</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BLOCO 3: SUGESTÕES DE DELEGAÇÃO (I.A.) */}
          <div key="delegation-ai" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800 flex flex-col transition-all group-hover:border-violet-500 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>
              <CardHeader className="bg-slate-900/40 px-4 py-3 border-b border-slate-700 cursor-move relative z-10">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <Users size={14} className="text-violet-400"/> Inteligência de Delegação
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-6 relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="text-orange-500" /> Alerta de Sobrecarga: Designer Sênior
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xl">
                    O painel do Monday (Norte Performance) indica que o Designer Sênior está com 22 tarefas ativas. A qualidade de entrega e a biometria dele podem ser afetadas.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50">
                    Acionar Agente de Drop-Service
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800">
                    Remanejar Tarefas Automaticamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </GridLayout>
      </div>
    </div>
  );
}
