"use client";

import React, { useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Radio, Newspaper, Flame, BrainCircuit, Activity, Dumbbell, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NorteVideoPlayer } from "@/components/social/NorteVideoPlayer";
import { toast } from "sonner";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "social-events", x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
  { i: "infohub-shorts", x: 6, y: 0, w: 3, h: 6, minW: 3, minH: 5 },
  { i: "oracle-news", x: 9, y: 0, w: 3, h: 6, minW: 3, minH: 4 },
];

export default function MultimodalFeedPage() {
  const [layout, setLayout] = useState<Layout[]>(DEFAULT_LAYOUT);

  const handleVideoComplete = () => {
    toast.success("Treino Finalizado com Sucesso!", {
      description: "Vídeo concluído. +50 de Reputação e R$ 2 em Cashback adicionados à sua Wallet.",
      icon: <Activity className="text-emerald-500" />
    });
  };

  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Radio className="text-cyan-500 animate-pulse" size={32}/> Norte Stream
          </h1>
          <p className="text-slate-400 mt-1">O tecido conectivo do ecossistema. Notícias, Cursos e Social Feed em uma interface única.</p>
        </div>
        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 font-bold text-sm flex items-center gap-2">
          <Flame size={16} /> Hot Content
        </div>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-cyan-500/30 rounded-2xl p-4 min-h-[700px]">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={80}
          width={1200} // Mock width
          onLayoutChange={(l) => setLayout(l)}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {/* FEED DE EVENTOS SOCIAIS */}
          <div key="social-events" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-cyan-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <Activity size={14} className="text-emerald-400"/> Atividades Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-slate-800">
                  <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">P</div>
                      <div>
                        <p className="text-sm font-bold text-white">Pedro</p>
                        <p className="text-xs text-slate-500">Há 2 minutos • Marketplace Hub</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm flex items-center gap-2">
                      <ShoppingBag size={14} className="text-violet-400"/> Acaba de realizar a primeira venda de "Whey Isolado" como afiliado!
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">+10 Reputação</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">M</div>
                      <div>
                        <p className="text-sm font-bold text-white">Marcos V.</p>
                        <p className="text-xs text-slate-500">Há 15 minutos • Norte Performance</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm flex items-center gap-2">
                      <Dumbbell size={14} className="text-orange-400"/> Bateu PR (Personal Record) no Supino Reto: 120kg.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* INFOHUB SHORTS */}
          <div key="infohub-shorts" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-black flex flex-col transition-all group-hover:border-cyan-500 shadow-xl relative">
              <div className="absolute top-2 left-2 z-20 bg-emerald-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded">
                InfoHub Shorts
              </div>
              <NorteVideoPlayer 
                src="mock-video-url" 
                title="Técnica: Agachamento Livre (Módulo 1)" 
                onComplete={handleVideoComplete}
              />
            </Card>
          </div>

          {/* ORACLE NEWS (SCRAPER) */}
          <div key="oracle-news" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-cyan-500 shadow-xl">
              <CardHeader className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <BrainCircuit size={14} className="text-blue-400"/> Market Intel (Oráculo)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto bg-slate-900">
                <div className="divide-y divide-slate-800">
                  <div className="p-4 border-l-2 border-blue-500 bg-blue-500/5">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Arbitragem de Preços</span>
                    <p className="text-sm font-bold text-white leading-tight">O preço da carne Bovina caiu 4% nos distribuidores B2B da sua região.</p>
                    <p className="text-xs text-slate-500 mt-2">Dica da I.A.: Ajuste a precificação no seu Gastro Hub para aumentar margem.</p>
                  </div>
                  <div className="p-4 border-l-2 border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Concorrência</span>
                    <p className="text-sm font-bold text-slate-300 leading-tight">Agência local iniciou nova campanha de anúncios no Meta Ads.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </GridLayout>
      </div>
    </div>
  );
}
