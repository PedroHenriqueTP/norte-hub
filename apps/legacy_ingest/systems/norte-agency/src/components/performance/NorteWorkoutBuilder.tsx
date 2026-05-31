"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Dumbbell, Activity, Timer, Save, GripHorizontal, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "exercicio-base", x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "series-reps", x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
  { i: "intervalo", x: 6, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
];

export function NorteWorkoutBuilder({ routineId }: { routineId?: string }) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Busca do Neon DB simulada
    const savedLayout = localStorage.getItem(`norte-fitness-${routineId || 'default'}`);
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(DEFAULT_LAYOUT);
    }
    setIsMounted(true);
  }, [routineId]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    // Acionaria a Server Action para salvar o JSON amorfo da rotina no banco
    setTimeout(() => {
      localStorage.setItem(`norte-fitness-${routineId || 'default'}`, JSON.stringify(layout));
      
      // Simula a lógica de Bio-Hacking (Sugerir suplemento após montar treino pesado)
      toast.success("Treino salvo! Analisando demanda metabólica...", { duration: 2000 });
      
      setTimeout(() => {
        toast("Norte Store Suggestion: Whey Protein", {
          description: "Sua rotina exige alta recuperação. Deseja usar seu Cashback para comprar Norte Whey agora?",
          icon: <ShoppingBag className="text-emerald-500" />,
          action: {
            label: "Comprar",
            onClick: () => console.log("Redirecionar para o CheckoutSimbionte")
          }
        });
      }, 2500);

      setIsSaving(false);
    }, 800);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GripHorizontal className="text-red-500"/> Morphic Fitness (Treino Simbionte)
          </h2>
          <p className="text-xs text-slate-400">Arraste os blocos para montar a rotina biológica perfeita.</p>
        </div>
        <Button 
          onClick={handleSaveAndSync} 
          disabled={isSaving}
          className="bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
        >
          <Save className="mr-2 h-4 w-4" /> {isSaving ? "Sincronizando Biometria..." : "Salvar Treino"}
        </Button>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-red-500/30 rounded-2xl p-4 min-h-[500px]">
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
          {/* BLOCO 1: EXERCÍCIO BASE */}
          <div key="exercicio-base" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-900 flex flex-col transition-all group-hover:border-red-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase">
                  <Dumbbell size={14} className="text-red-400"/> Exercício de Força
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
                <h3 className="text-2xl font-black text-white tracking-widest uppercase">Supino Inclinado (Halter)</h3>
                <p className="text-xs text-slate-400 mt-2 font-bold">Foco: Hipertrofia do Feixe Clavicular</p>
              </CardContent>
            </Card>
          </div>

          {/* BLOCO 2: SÉRIES E REPS */}
          <div key="series-reps" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-red-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase">
                  <Activity size={14} className="text-orange-400"/> Volume
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center gap-1 p-4">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">4</span>
                  <span className="text-slate-500 font-bold mb-1">séries</span>
                </div>
                <div className="text-xl font-bold text-orange-400">8 - 12 Reps</div>
                <div className="text-[10px] text-slate-400 uppercase mt-2 border-t border-slate-700 w-full pt-2">Falha Concêntrica</div>
              </CardContent>
            </Card>
          </div>

          {/* BLOCO 3: INTERVALO E ISOMETRIA */}
          <div key="intervalo" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-red-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase">
                  <Timer size={14} className="text-blue-400"/> Tempo sob Tensão
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center gap-2 p-4">
                <div className="text-3xl font-black text-white">90 seg</div>
                <p className="text-xs font-bold text-blue-400">Descanso Ativo</p>
                <div className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-300 mt-1">
                  10s Isometria no pico de contração
                </div>
              </CardContent>
            </Card>
          </div>

        </GridLayout>
      </div>
    </div>
  );
}
