"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, DollarSign, RefreshCw, Webhook, Monitor, Database, ArrowRight, LayoutTemplate } from "lucide-react";

type TimelinePoint = {
  date: string;
  revenue: number;
  activeUsers: number;
};

type HubSummaryResponse = {
  totals: {
    revenue: number;
    activeUsers: number;
    events: number;
    services: number;
  };
  timeline: TimelinePoint[];
  byService: Array<{
    service: string;
    revenue: number;
    activeUsers: number;
    events: number;
  }>;
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminHubPage() {
  const [data, setData] = useState<HubSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSummary() {
    setLoading(true);
    try {
      const res = await fetch("/api/webhooks/summary", { cache: "no-store" });
      const json = (await res.json()) as HubSummaryResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  const chartScale = useMemo(() => {
    const maxRevenue = Math.max(...(data?.timeline.map((point) => point.revenue) ?? [1]));
    const maxUsers = Math.max(...(data?.timeline.map((point) => point.activeUsers) ?? [1]));
    return {
      maxRevenue: maxRevenue > 0 ? maxRevenue : 1,
      maxUsers: maxUsers > 0 ? maxUsers : 1,
    };
  }, [data]);

  const systemsLibrary = [
    { name: "AgencyOS Core", type: "ERP Base", status: "ONLINE", icon: Monitor, bg: "bg-slate-900", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80" },
    { name: "MedCura CRM", type: "App Clínico", status: "BETA", icon: Activity, bg: "bg-blue-600", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&q=80" },
    { name: "NorteStore (Template)", type: "Marketplace", status: "READY", icon: LayoutTemplate, bg: "bg-emerald-600", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=500&q=80" },
  ];

  return (
    <div className="space-y-10 w-full overflow-hidden">
      {/* HEADER: NORTE LAUNCHPAD */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Webhook className="text-violet-600" /> Norte Global Hub</h1>
          <p className="text-slate-500">Livraria de sistemas, saúde de banco de dados e telemetria financeira.</p>
        </div>
        <button
          type="button"
          onClick={loadSummary}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <RefreshCw className="h-4 w-4" />
          Sincronizar Hub
        </button>
      </div>

      {/* NETFLIX-STYLE SYSTEM LIBRARY */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Monitor size={20} /> Meus Sistemas (Livraria Visual)
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
          {systemsLibrary.map((sys) => (
            <div key={sys.name} className="min-w-[300px] h-[180px] relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg snap-start border border-slate-200">
              <img src={sys.img} alt={sys.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40 group-hover:opacity-30" />
              <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90`}></div>
              
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white text-slate-900 uppercase tracking-wider`}>{sys.type}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider ${sys.status === 'ONLINE' ? 'bg-green-500' : 'bg-violet-500'}`}>{sys.status}</span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold leading-tight">{sys.name}</h3>
                <p className="text-sm text-slate-300 mt-1 flex items-center gap-1 group-hover:text-violet-300 transition-colors">
                  Acessar Painel <ArrowRight size={14} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DATABASE HEALTH (Multi-tenant) */}
        <section className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database size={20} className="text-blue-600" /> Saúde do Prisma DB
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-700">Storage (Multi-tenant)</span>
                <span className="text-sm font-bold text-slate-900">12% Uso</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-700">Marketplaces Conectados</span>
                <span className="text-sm font-bold text-slate-900">{(data?.totals.services ?? 0)} Nós</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIAL TELEMETRY (Original Webhook Graph) */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-emerald-600" /> Telemetria de Conversão
              </h2>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Receita Hub (MRR)</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(data?.totals.revenue ?? 0)}</p>
              </div>
           </div>
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-10">Carregando telemetria em tempo real...</p>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
              {(data?.timeline ?? []).map((point) => {
                const revenuePct = Math.round((point.revenue / chartScale.maxRevenue) * 100);
                const usersPct = Math.round((point.activeUsers / chartScale.maxUsers) * 100);
                return (
                  <div key={point.date} className="rounded-xl border border-slate-100 p-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>{point.date}</span>
                      <span>{formatCurrency(point.revenue)} | {point.activeUsers.toLocaleString("pt-BR")} leads</span>
                    </div>
                    <div className="mb-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${revenuePct}%` }} />
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-2 rounded-full bg-violet-500" style={{ width: `${usersPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
