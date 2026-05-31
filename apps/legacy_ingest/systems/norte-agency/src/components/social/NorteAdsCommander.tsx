"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Megaphone, GripHorizontal, DollarSign, Users, TrendingUp, Sparkles, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "roi-overview", x: 0, y: 0, w: 8, h: 4, minW: 6, minH: 3 },
  { i: "cpl-widget", x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "engagement-widget", x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "active-campaigns", x: 4, y: 4, w: 8, h: 4, minW: 6, minH: 3 },
];

export function NorteAdsCommander() {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);

  useEffect(() => {
    const savedLayout = localStorage.getItem('norte-ads-commander');
    setLayout(savedLayout ? JSON.parse(savedLayout) : DEFAULT_LAYOUT);
    setIsMounted(true);
  }, []);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem('norte-ads-commander', JSON.stringify(newLayout));
  };

  const handleAiBoost = () => {
    setIsBoosting(true);
    toast("🤖 The Architect: Analisando campanhas...", { duration: 2000 });
    
    setTimeout(() => {
      toast.success("Otimização Concluída!", {
        description: "Público-alvo refinado baseado nas conversões do Marketplace. Verba realocada para o conjunto de anúncios vencedor.",
      });
      setIsBoosting(false);
    }, 2500);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Megaphone className="text-orange-500" size={24}/> SMM & Ads Commander
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gestão de Tráfego Amorfa. Conecte o gasto real em anúncios às vendas no Marketplace Hub.
          </p>
        </div>
        <Button 
          onClick={handleAiBoost}
          disabled={isBoosting}
          className="bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all"
        >
          <Sparkles className="mr-2 h-4 w-4" /> {isBoosting ? "Otimizando..." : "Impulsionar com I.A."}
        </Button>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-orange-500/30 rounded-2xl p-4 min-h-[600px]">
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
          {/* ROI OVERVIEW */}
          <div key="roi-overview" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-orange-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center justify-between text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2"><DollarSign size={14} className="text-emerald-400"/> Retorno Transparente (ROI)</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-6 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">Gasto em Ads (Neon Sync)</p>
                    <p className="text-3xl font-black text-white">R$ 4.250,00</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase mb-1">Vendas no Marketplace</p>
                    <p className="text-3xl font-black text-emerald-400">R$ 18.900,00</p>
                  </div>
                </div>
                <div className="mt-4 text-xs bg-slate-800 px-3 py-2 rounded-lg text-slate-300 border border-slate-700 flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500"/> ROAS de 4.4x nas últimas 24h.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CUSTO POR LEAD (CPL) */}
          <div key="cpl-widget" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-orange-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <Users size={14} className="text-blue-400"/> Custo Por Lead (CPL)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-5xl font-black text-white">R$ 1,45</span>
                <span className="text-xs font-bold text-emerald-500 uppercase mt-2">-12% vs. Ontem</span>
              </CardContent>
            </Card>
          </div>

          {/* TAXA DE ENGAJAMENTO */}
          <div key="engagement-widget" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-orange-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <PieChart size={14} className="text-violet-400"/> Engajamento Orgânico
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white">8.4%</span>
                <span className="text-xs font-medium text-slate-400 mt-2">DMs e Comentários automatizados por I.A.</span>
              </CardContent>
            </Card>
          </div>

          {/* CAMPANHAS ATIVAS */}
          <div key="active-campaigns" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-orange-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <Activity size={14} className="text-orange-400"/> Campanhas Ativas (Meta & Google)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                <ul className="divide-y divide-slate-800">
                  <li className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Promoção InfoHub (Remarketing)</p>
                      <p className="text-xs text-emerald-400">Status: Ativo e Otimizando</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-200">R$ 150/dia</p>
                    </div>
                  </li>
                  <li className="p-4 flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                    <div>
                      <p className="font-bold text-white text-sm">Captação de Revendedores B2B</p>
                      <p className="text-xs text-orange-400">Status: CPL Acima da Média</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-200">R$ 300/dia</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </GridLayout>
      </div>
    </div>
  );
}
