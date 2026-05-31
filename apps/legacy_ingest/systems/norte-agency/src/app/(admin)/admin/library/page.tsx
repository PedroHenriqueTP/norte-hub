import React from "react";
import { getConsolidatedBilling } from "@/actions/billing";
import { Monitor, Activity, LayoutTemplate, Database, Server, Cpu, Layers } from "lucide-react";
import Link from "next/link";

export default async function SystemsLibraryPage() {
  const { globalMetrics, tenants } = await getConsolidatedBilling();

  // Mocks for system libraries - enhanced with real DB metrics
  const systemsLibrary = [
    { 
      id: "agency-os",
      name: "AgencyOS Core", 
      type: "SaaS Base & ERP", 
      status: "ONLINE", 
      icon: Monitor, 
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      stats: {
        dbHealth: "99.9% Uptime",
        dbUsage: `${Math.max(1, Math.round(globalMetrics.totalJobs * 0.5))} MB`,
        leads: globalMetrics.totalLeads,
        tenants: tenants.length
      },
      link: "/admin/hub"
    },
    { 
      id: "medcura-crm",
      name: "MedCura CRM", 
      type: "App Clínico Enterprise", 
      status: "BETA", 
      icon: Activity, 
      img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      stats: {
        dbHealth: "Provisioning",
        dbUsage: "0.5 MB",
        leads: 0,
        tenants: 0
      },
      link: "#"
    },
    { 
      id: "norte-store",
      name: "NorteStore Marketplaces", 
      type: "Template Hub", 
      status: "READY", 
      icon: LayoutTemplate, 
      img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      stats: {
        dbHealth: "100% Uptime",
        dbUsage: `${Math.max(1, Math.round(globalMetrics.totalLeads * 0.1))} MB`,
        leads: globalMetrics.totalLeads,
        tenants: tenants.length
      },
      link: "/admin/tenants"
    },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-slate-50 text-slate-900 font-sans space-y-10">
      
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider rounded-full w-max">
          <Layers size={14} /> Global Launchpad
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">Livraria de Sistemas</h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Visualização arquitetural e telemetria de banco de dados do ecossistema É a Norte. Luxo, velocidade e controle total.
        </p>
      </div>

      {/* SYSTEMS GRID (NETFLIX STYLE FINTECH) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {systemsLibrary.map((sys) => {
          const Icon = sys.icon;
          const isOnline = sys.status === "ONLINE" || sys.status === "READY";
          
          return (
            <Link href={sys.link} key={sys.id} className="group block relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              
              {/* Image Preview Area */}
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img 
                  src={sys.img} 
                  alt={sys.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-white uppercase tracking-wider border border-white/20">
                    {sys.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded text-white uppercase tracking-wider shadow-sm flex items-center gap-1
                    ${isOnline ? 'bg-emerald-500/90 backdrop-blur-md' : 'bg-violet-500/90 backdrop-blur-md'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-white ${isOnline ? 'animate-pulse' : ''}`}></span>
                    {sys.status}
                  </span>
                </div>
              </div>

              {/* Data & Telemetry Area */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Icon className="text-slate-400" size={24} /> {sys.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                      <Database size={12} className="text-blue-500"/> DB Usage
                    </span>
                    <span className="font-bold text-slate-900">{sys.stats.dbUsage}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                      <Server size={12} className={isOnline ? "text-emerald-500" : "text-violet-500"}/> DB Health
                    </span>
                    <span className="font-bold text-slate-900">{sys.stats.dbHealth}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                      <Cpu size={12} className="text-orange-500"/> Nós (Tenants)
                    </span>
                    <span className="font-bold text-slate-900">{sys.stats.tenants} Conectados</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                      <Activity size={12} className="text-rose-500"/> Leads Proc.
                    </span>
                    <span className="font-bold text-slate-900">{sys.stats.leads.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
