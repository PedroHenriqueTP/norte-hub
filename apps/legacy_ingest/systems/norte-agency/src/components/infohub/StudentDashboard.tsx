"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PlayCircle, Trophy, MessageSquare, Save, GripHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "video-player", x: 0, y: 0, w: 8, h: 8, minW: 6, minH: 6 },
  { i: "progress-widget", x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "forum-widget", x: 8, y: 4, w: 4, h: 4, minW: 3, minH: 4 },
];

export function StudentDashboardEditor({ infoproductId }: { infoproductId?: string }) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulando busca do layout de ensino salvo no Neon DB
    const savedLayout = localStorage.getItem(`info-canvas-${infoproductId || 'default'}`);
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(DEFAULT_LAYOUT);
    }
    setIsMounted(true);
  }, [infoproductId]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const handleSaveToNeon = async () => {
    setIsSaving(true);
    // Em produção: Server Action que salva o JSON no campo `contentLibrary` do Infoproduct
    setTimeout(() => {
      localStorage.setItem(`info-canvas-${infoproductId || 'default'}`, JSON.stringify(layout));
      toast.success("Área de Membros sincronizada com o Neon DB!");
      setIsSaving(false);
    }, 800);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GripHorizontal className="text-emerald-500"/> Edu-Canvas (Drag & Drop)
          </h2>
          <p className="text-xs text-slate-400">Personalize a área de membros. Essa interface será entregue ao aluno.</p>
        </div>
        <Button 
          onClick={handleSaveToNeon} 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Save className="mr-2 h-4 w-4" /> {isSaving ? "Sincronizando..." : "Salvar no Neon"}
        </Button>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-emerald-500/30 rounded-2xl p-4 min-h-[500px]">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={1000} // Mocked width
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {/* PLAYER DE VÍDEO SIMBIONTE */}
          <div key="video-player" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-emerald-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <PlayCircle size={14} className="text-emerald-400"/> Player Simbionte
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-black/50">
                <PlayCircle size={64} className="text-slate-700 mb-4" />
                <p className="text-sm font-bold text-slate-400">Espaço do Vídeo/Módulo</p>
                <div className="absolute bottom-2 left-2 text-[10px] text-emerald-500/50 uppercase tracking-widest font-black">DRM PROTECTED</div>
              </CardContent>
            </Card>
          </div>

          {/* WIDGET DE PROGRESSO / CERTIFICADO */}
          <div key="progress-widget" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-emerald-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <Trophy size={14} className="text-yellow-400"/> Gamificação
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="text-4xl font-black text-white">65%</div>
                <div className="w-full bg-slate-900 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Emissão de Certificado Automática aos 100%</p>
              </CardContent>
            </Card>
          </div>

          {/* FÓRUM / COMUNIDADE */}
          <div key="forum-widget" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-emerald-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <MessageSquare size={14} className="text-blue-400"/> Fórum Simbionte
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                <div className="bg-slate-700/50 p-2 rounded text-xs text-slate-300 border-l-2 border-blue-500">
                  "Como aplico a técnica da Aula 3?"
                </div>
                <div className="bg-slate-700/50 p-2 rounded text-xs text-slate-300 border-l-2 border-blue-500">
                  "O arquivo PDF de apoio está com erro."
                </div>
                <div className="mt-auto text-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-700">
                  Integração c/ Webhooks ativa
                </div>
              </CardContent>
            </Card>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
