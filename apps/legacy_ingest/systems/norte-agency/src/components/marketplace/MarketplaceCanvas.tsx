"use client";

import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PackageOpen, Star, Image as ImageIcon, Save, GripHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_LAYOUT: Layout[] = [
  { i: "banner-oferta", x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "modulo-produto-1", x: 0, y: 4, w: 4, h: 6, minW: 3, minH: 4 },
  { i: "modulo-produto-2", x: 4, y: 4, w: 4, h: 6, minW: 3, minH: 4 },
  { i: "widget-reviews", x: 8, y: 4, w: 4, h: 6, minW: 3, minH: 4 },
];

export function MarketplaceCanvas({ marketplaceId }: { marketplaceId?: string }) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulando busca do layout salvo no Neon DB vinculado ao MarketplaceAsset
    const savedLayout = localStorage.getItem(`mkp-canvas-${marketplaceId || 'default'}`);
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(DEFAULT_LAYOUT);
    }
    setIsMounted(true);
  }, [marketplaceId]);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const handleSaveToNeon = async () => {
    setIsSaving(true);
    // Aqui acionaríamos a Server Action updateMarketplaceLayout(marketplaceId, layout)
    setTimeout(() => {
      localStorage.setItem(`mkp-canvas-${marketplaceId || 'default'}`, JSON.stringify(layout));
      toast.success("Grid amorfo sincronizado com o Neon DB!");
      setIsSaving(false);
    }, 800);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GripHorizontal className="text-violet-500"/> Vitrine Drag & Drop
          </h2>
          <p className="text-xs text-slate-400">Personalize a vitrine do revendedor em tempo real.</p>
        </div>
        <Button 
          onClick={handleSaveToNeon} 
          disabled={isSaving}
          className="bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
        >
          <Save className="mr-2 h-4 w-4" /> {isSaving ? "Sincronizando..." : "Salvar no Neon"}
        </Button>
      </div>

      <div className="bg-slate-800/30 border-2 border-dashed border-violet-500/30 rounded-2xl p-4 min-h-[500px]">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={1000} // Mocked static width for preview, production uses responsive wrapper
          onLayoutChange={onLayoutChange}
          isDraggable={true}
          isResizable={true}
          margin={[16, 16]}
        >
          {/* BANNER DE OFERTA */}
          <div key="banner-oferta" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 flex flex-col transition-all group-hover:border-violet-500">
              <CardHeader className="bg-slate-900/80 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white uppercase tracking-wider">
                  <ImageIcon size={14} className="text-fuchsia-400"/> Hero Banner Promo
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <h3 className="text-3xl font-black text-white relative z-10 drop-shadow-lg">BLACK FRIDAY 50% OFF</h3>
              </CardContent>
            </Card>
          </div>

          {/* MÓDULO PRODUTO 1 */}
          <div key="modulo-produto-1" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-violet-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <PackageOpen size={14} className="text-blue-400"/> Destaque 1
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-700 mb-2"></div>
                <p className="text-sm font-bold text-white">Premium T-Shirt</p>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">R$ 89,90</span>
              </CardContent>
            </Card>
          </div>

          {/* MÓDULO PRODUTO 2 */}
          <div key="modulo-produto-2" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-violet-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <PackageOpen size={14} className="text-blue-400"/> Destaque 2
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className="w-16 h-16 rounded-full bg-slate-700 mb-2"></div>
                <p className="text-sm font-bold text-white">Urban Hoodie</p>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">R$ 149,90</span>
              </CardContent>
            </Card>
          </div>

          {/* WIDGET REVIEWS */}
          <div key="widget-reviews" className="rounded-xl overflow-hidden group">
            <Card className="h-full border-slate-700 bg-slate-800 flex flex-col transition-all group-hover:border-violet-500">
              <CardHeader className="bg-slate-900 px-3 py-2 border-b border-slate-700 cursor-move">
                <CardTitle className="text-xs flex items-center gap-2 text-white">
                  <Star size={14} className="text-yellow-400"/> Prova Social
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/>
                </div>
                <p className="text-xs text-slate-300 italic">"Melhor qualidade que já vi, entrega super rápida no drop!"</p>
                <div className="mt-auto flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-600"></div>
                  <span className="text-[10px] text-slate-400">João P. (Compra Verificada)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}
