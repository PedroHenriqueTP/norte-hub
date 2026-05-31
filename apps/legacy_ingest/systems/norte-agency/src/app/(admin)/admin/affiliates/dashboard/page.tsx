"use client";

import React, { useState } from "react";
import { Copy, Target, Link as LinkIcon, BarChart3, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CashbackWallet } from "@/components/fintech/CashbackWallet";

const MOCK_AFFILIATE = {
  id: "aff-998877",
  name: "Revendedor Elite",
  uniqueLink: "https://hub.soberanianorte.com/ref/aff-998877",
  metrics: {
    clicks: 1450,
    conversions: 89,
    totalEarned: 4500.00,
    walletBalance: 450.00 // Simulando um saldo remanescente disponível no Ledger
  }
};

export default function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(MOCK_AFFILIATE.uniqueLink);
    setCopied(true);
    toast.success("Link de Afiliação copiado! Dispare para seus leads.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 text-slate-100 font-sans space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER: O EXÉRCITO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Target size={14} /> Hub de Afiliados (Exército Norte)
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Cross-SaaS Affiliate Engine
          </h1>
          <p className="text-slate-400 mt-1">
            Seu link vende em qualquer hub da plataforma (Cursos, Marketplace e Restaurante).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LINK ÚNICO E MÉTRICAS */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="bg-slate-800/50 border-slate-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <CardContent className="p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Seu Link Simbionte</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3 text-white font-mono text-sm w-full">
                  <LinkIcon size={16} className="text-red-400" />
                  <span className="truncate">{MOCK_AFFILIATE.uniqueLink}</span>
                </div>
                <Button 
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold h-11"
                >
                  <Copy size={16} className="mr-2" /> {copied ? "Copiado!" : "Copiar Link"}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                O cookie desse link rastreia a jornada do cliente em todos os sub-produtos da Norte.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BarChart3 className="text-blue-400 mb-2" size={24} />
                <span className="text-3xl font-black text-white">{MOCK_AFFILIATE.metrics.clicks}</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Tráfego (Cliques)</span>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="text-violet-400 mb-2" size={24} />
                <span className="text-3xl font-black text-white">{MOCK_AFFILIATE.metrics.conversions}</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Conversões (Vendas)</span>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/30 border-slate-700 relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                <DollarSign className="text-emerald-400 mb-2" size={24} />
                <span className="text-3xl font-black text-white">R$ {(MOCK_AFFILIATE.metrics.totalEarned / 1000).toFixed(1)}k</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Total Ganho</span>
              </CardContent>
            </Card>
          </div>
          
        </div>

        {/* FINTECH: RESGATE DE COMISSÕES (CASHBACK WALLET INJETADA) */}
        <div className="lg:col-span-1">
          <div className="h-full">
            {/* Reutilizando o poder do componente de Cashback que construímos para o FinanceHub */}
            <CashbackWallet initialBalance={MOCK_AFFILIATE.metrics.walletBalance} />
          </div>
        </div>

      </div>
    </div>
  );
}
