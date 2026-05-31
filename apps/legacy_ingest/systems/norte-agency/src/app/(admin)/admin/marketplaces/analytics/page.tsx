"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Store,
  ArrowUpRight,
  Activity,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceCanvas } from "@/components/marketplace/MarketplaceCanvas";

// Mocks simulando dados isolados pelo Tenant via Neon DB
const MOCK_ANALYTICS = {
  gmv: 145890.50,
  gmvGrowth: "+12.5%",
  activeResellers: 42,
  resellerGrowth: "+3 esta semana",
  totalCashbackGenerated: 12500.00,
  topResellers: [
    { name: "Alpha Store (Drop)", sales: 45000, conversion: "4.2%" },
    { name: "Beta Trends", sales: 32100, conversion: "3.8%" },
    { name: "Gamma Style", sales: 18400, conversion: "2.9%" },
  ]
};

export default function MarketplaceAnalyticsPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 text-slate-100 font-sans space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DA MARCA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            <Store size={14} /> Brand Owner Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Norte Marketplace Hub
          </h1>
          <p className="text-slate-400 mt-1">
            Gestão End-to-End: Telemetria de Revendedores, Vitrine Amorfa e Split Financeiro.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-sm font-bold text-slate-300">Soberania de Dados: ATIVADA</span>
        </div>
      </div>

      {/* KPIs (GMV, Revendedores, Cashback) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GMV */}
        <Card className="glass-card border-l-4 border-l-violet-500/50 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Volume Bruto (GMV)</CardTitle>
            <div className="p-2 rounded-lg bg-violet-500/10">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">
              R$ {MOCK_ANALYTICS.gmv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs font-medium text-emerald-400 flex items-center mt-2">
              <ArrowUpRight size={12} className="mr-1"/> {MOCK_ANALYTICS.gmvGrowth} vs. último mês
            </p>
          </CardContent>
        </Card>

        {/* Revendedores */}
        <Card className="glass-card border-l-4 border-l-blue-500/50 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Eficácia de Revendedores</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">
              {MOCK_ANALYTICS.activeResellers} <span className="text-lg text-slate-500 font-normal">ativos</span>
            </div>
            <p className="text-xs font-medium text-blue-400 flex items-center mt-2">
              <Activity size={12} className="mr-1"/> {MOCK_ANALYTICS.resellerGrowth}
            </p>
          </CardContent>
        </Card>

        {/* Cashback */}
        <Card className="glass-card border-l-4 border-l-emerald-500/50 bg-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cashback Gerado (Ecossistema)</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Wallet className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-white">
              R$ {MOCK_ANALYTICS.totalCashbackGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs font-medium text-emerald-400 mt-2">
               Crédito injetado na Wallet dos revendedores.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RANKING DE REVENDEDORES */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700/50">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Layers className="text-blue-400" size={18}/> Top Revendedores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-slate-700/50">
                {MOCK_ANALYTICS.topResellers.map((reseller, idx) => (
                  <li key={idx} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                    <div>
                      <p className="font-bold text-slate-200">{reseller.name}</p>
                      <p className="text-xs text-slate-500">Conversão: {reseller.conversion}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white">R$ {(reseller.sales / 1000).toFixed(1)}k</p>
                      <p className="text-[10px] text-emerald-400 font-bold">Liderando</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* VITRINE DRAG & DROP (MORPHIC ENGINE EMBEDDED) */}
        <div className="lg:col-span-2">
          <MarketplaceCanvas marketplaceId="brand-owner-main" />
        </div>

      </div>
    </div>
  );
}
