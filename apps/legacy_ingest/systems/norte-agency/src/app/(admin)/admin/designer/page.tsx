"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { CreditCard, Grid3X3, Settings2, Save, UtensilsCrossed, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INITIAL_LAYOUT: Layout[] = [
  { i: "fintech-wallet", x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "gastro-tables", x: 4, y: 0, w: 8, h: 6, minW: 6, minH: 4 },
  { i: "telemetry", x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2 },
];

export default function NorteDesignerPage() {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Carrega layout do "banco de dados" (Local storage mock para demonstração)
    const savedLayout = localStorage.getItem("norte-morphic-layout");
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(INITIAL_LAYOUT);
    }
    setIsMounted(true);
  }, []);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const saveLayout = () => {
    localStorage.setItem("norte-morphic-layout", JSON.stringify(layout));
    setIsEditing(false);
    // Aqui no futuro dispararia um Server Action: saveTenantCanvasPrefs(layout)
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 text-slate-100">
      
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Grid3X3 className="text-violet-500" size={32}/> Norte Morphic Engine
          </h1>
          <p className="text-slate-400 mt-1">
            Editor visual simbiótico. Arraste e dimensione as capacidades do sistema.
          </p>
        </div>

        <div className="flex gap-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Settings2 size={18} /> Ativar Modo Edição (Drag & Drop)
            </button>
          ) : (
            <button 
              onClick={saveLayout}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              <Save size={18} /> Salvar Layout no Banco (Neon)
            </button>
          )}
        </div>
      </div>

      {/* CANVAS GRID */}
      <div className={`transition-all duration-500 ${isEditing ? 'bg-slate-800/30 border-2 border-dashed border-violet-500/50 rounded-2xl p-4' : ''}`}>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={60}
          width={1200} // Mocked width, would use react-sizeme in production
          onLayoutChange={onLayoutChange}
          isDraggable={isEditing}
          isResizable={isEditing}
          compactType="vertical"
          margin={[24, 24]}
        >
          {/* SIMBIONTE 1: Carteira Digital (Fintech) */}
          <div key="fintech-wallet" className={`rounded-2xl transition-all ${isEditing ? 'border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''}`}>
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col overflow-hidden">
              <CardHeader className="bg-slate-900 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-sm flex items-center gap-2 font-bold text-white"><CreditCard size={16} className="text-emerald-400"/> Digital Wallet (Cashback)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4 relative">
                 <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Saldo Disponível</p>
                 <h2 className="text-5xl font-black text-white">R$ 1.450<span className="text-xl text-slate-500">,00</span></h2>
                 <p className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">+ R$ 45,00 gerados hoje (Jobs)</p>
              </CardContent>
            </Card>
          </div>

          {/* SIMBIONTE 2: Mapa de Mesas (Gastro Hub) */}
          <div key="gastro-tables" className={`rounded-2xl transition-all ${isEditing ? 'border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''}`}>
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col overflow-hidden">
              <CardHeader className="bg-slate-900 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-sm flex items-center gap-2 font-bold text-white"><UtensilsCrossed size={16} className="text-orange-400"/> Mapa de Mesas (Norte Gastro)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 grid grid-cols-4 gap-4 bg-slate-900/50">
                 {[1,2,3,4,5,6,7,8].map((table) => (
                   <div key={table} className={`rounded-xl border flex flex-col items-center justify-center p-4 transition-colors ${table === 3 || table === 5 ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      <span className="text-xs font-bold mb-1">MESA {table}</span>
                      <span className="text-2xl font-black text-white">{table === 3 ? 'R$ 120' : table === 5 ? 'R$ 45' : 'LIVRE'}</span>
                   </div>
                 ))}
              </CardContent>
            </Card>
          </div>

          {/* SIMBIONTE 3: Telemetria de Banco */}
          <div key="telemetry" className={`rounded-2xl transition-all ${isEditing ? 'border-2 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''}`}>
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col overflow-hidden">
              <CardHeader className="bg-slate-900 px-4 py-3 border-b border-slate-700 cursor-move">
                <CardTitle className="text-sm flex items-center gap-2 font-bold text-white"><Database size={16} className="text-blue-400"/> Neon DB Link</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-center gap-2">
                 <div className="w-full bg-slate-900 rounded-full h-2 mb-1">
                   <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>Storage (25%)</span>
                    <span className="text-emerald-400">ONLINE</span>
                 </div>
              </CardContent>
            </Card>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
