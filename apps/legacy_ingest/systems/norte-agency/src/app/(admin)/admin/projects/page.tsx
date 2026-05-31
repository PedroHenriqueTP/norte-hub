"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, Server, Users, Activity, ExternalLink, Wand2 } from "lucide-react";

// Mock data based on the UserProject schema
const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Clinica Odonto AXIS",
    slug: "clinica-odonto-axis",
    category: "HEALTH",
    status: "ONLINE",
    sales: 12500,
    leads: 340,
    uxScore: 98
  },
  {
    id: "2",
    name: "Burger & Co (Gastro Hub)",
    slug: "burger-co",
    category: "GASTRO",
    status: "ONLINE",
    sales: 45000,
    leads: 1200,
    uxScore: 92
  },
  {
    id: "3",
    name: "Agência B2B Connect",
    slug: "b2b-connect",
    category: "ENTERPRISE",
    status: "BUILDING",
    sales: 0,
    leads: 0,
    uxScore: 85
  }
];

export default function SaaSManagerPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Server className="text-cyan-500" /> SaaS Manager
          </h1>
          <p className="text-slate-400 mt-1">Gerencie suas instâncias provisionadas no Neon Cloud.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar projeto..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-full transition-colors">
            <Filter size={18} />
          </button>
          <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} /> Lançar Novo SaaS
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-colors group">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                <a href={`https://${project.slug}.axis.com`} target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:underline flex items-center gap-1">
                  {project.slug}.axis.com <ExternalLink size={10} />
                </a>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${project.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/50">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-1"><DollarSign size={12}/> Vendas</span>
                <span className="text-white font-black">R$ {project.sales.toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/50">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-1"><Users size={12}/> Leads</span>
                <span className="text-white font-black">{project.leads}</span>
              </div>
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800/50">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-1"><Activity size={12}/> UX Score</span>
                <span className={project.uxScore > 90 ? "text-emerald-400 font-black" : "text-orange-400 font-black"}>{project.uxScore}/100</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/30 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <Wand2 size={16} /> Morphic Designer
              </button>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 rounded-xl text-sm font-bold transition-colors">
                Settings
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
