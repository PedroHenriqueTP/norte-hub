"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Users,
  TrendingUp,
  Box,
  LayoutTemplate,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

// Mock Data
const MOCK_SITES = [
  {
    id: "st-cafe",
    name: "st-cafe",
    url: "https://st-cafe.soberanianorte.com",
    status: "active",
    deployStatus: "success",
    lastDeploy: "10m ago",
    leads24h: 12,
    totalLeads: 154,
    template: "Cafe Premium v2"
  },
  {
    id: "st-moveis",
    name: "st-moveis",
    url: "https://st-moveis.soberanianorte.com",
    status: "active",
    deployStatus: "building",
    lastDeploy: "Just now",
    leads24h: 5,
    totalLeads: 42,
    template: "Furniture Modern"
  },
  {
    id: "st-advogados",
    name: "st-advogados",
    url: "https://st-advogados.soberanianorte.com",
    status: "inactive",
    deployStatus: "failed",
    lastDeploy: "2h ago",
    leads24h: 0,
    totalLeads: 0,
    template: "Lawyer Classic"
  }
];

export default function SiteManagerDashboard() {
  const [sites, setSites] = useState(MOCK_SITES);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Stats
  const totalLeads24h = sites.reduce((acc, site) => acc + site.leads24h, 0);
  const activeSites = sites.filter(s => s.status === 'active').length;

  const handleProvision = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      alert("Integração com Vercel API pendente. Clonando template...");
    }, 1500);
  };

  const getDeployStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Pronto</span>;
      case 'building':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Building</span>;
      case 'failed':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded-full border border-red-500/20"><AlertCircle className="w-3.5 h-3.5" /> Falhou</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-zinc-500/10 text-zinc-400 rounded-full border border-zinc-500/20"><Clock className="w-3.5 h-3.5" /> Pendente</span>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-500" />
            Hub de Sites
          </h1>
          <p className="text-zinc-400 mt-1">
            Gerencie seus templates, monitore deploys na Vercel e acompanhe captação de leads.
          </p>
        </div>
        <button 
          onClick={handleProvision}
          disabled={isProvisioning}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-70"
        >
          {isProvisioning ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
          Provisionar Novo Site
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Sites Ativos</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{activeSites}</p>
          <p className="text-sm text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +1</span> este mês
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Leads (Últimas 24h)</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{totalLeads24h}</p>
          <p className="text-sm text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +15%</span> vs. ontem
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Total de Leads</h3>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100">{sites.reduce((acc, s) => acc + s.totalLeads, 0)}</p>
          <p className="text-sm text-zinc-500 mt-2">Através de {sites.length} campanhas</p>
        </motion.div>
      </div>

      {/* Sites List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl backdrop-blur-xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-zinc-800/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Sites Monitorados</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Ver Todos
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-400 text-sm">
                <th className="px-6 py-4 font-medium">Site & Template</th>
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium">Status Vercel</th>
                <th className="px-6 py-4 font-medium">Leads (24h)</th>
                <th className="px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {sites.map((site) => (
                <tr key={site.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700/50">
                        <Box className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-zinc-100 font-medium">{site.name}</p>
                        <p className="text-xs text-zinc-500">{site.template}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={site.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm"
                    >
                      {new URL(site.url).hostname}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      {getDeployStatusBadge(site.deployStatus)}
                      <span className="text-xs text-zinc-500">{site.lastDeploy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-medium">{site.leads24h}</span>
                      {site.leads24h > 0 && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                          Novos
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      {/* Visual Library Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-purple-400" />
            Livraria Visual de Componentes (Fintech UI)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard Preview */}
          <div className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-colors group">
            <div className="h-40 bg-zinc-800/50 flex items-center justify-center overflow-hidden relative">
              {/* Fake UI Representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-50"></div>
              <div className="w-3/4 h-24 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg flex flex-col p-3 z-10 transform group-hover:scale-105 transition-transform">
                <div className="h-3 w-1/3 bg-zinc-700 rounded mb-2"></div>
                <div className="flex gap-2 mb-2">
                  <div className="h-10 w-1/2 bg-zinc-700/50 rounded"></div>
                  <div className="h-10 w-1/2 bg-zinc-700/50 rounded"></div>
                </div>
                <div className="h-4 w-full bg-blue-500/20 rounded mt-auto">
                   <div className="h-full bg-blue-500 w-2/3 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-zinc-100 font-semibold mb-1">Global Dashboard</h3>
              <p className="text-xs text-zinc-400">Visão panorâmica de MRR e status de sub-sistemas em tempo real.</p>
            </div>
          </div>

          {/* Billing Preview */}
          <div className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
            <div className="h-40 bg-zinc-800/50 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-50"></div>
              <div className="w-3/4 h-24 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg flex flex-col p-3 z-10 transform group-hover:scale-105 transition-transform gap-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-1/4 bg-zinc-700 rounded"></div>
                  <div className="h-3 w-1/6 bg-emerald-500/50 rounded"></div>
                </div>
                <div className="h-12 w-full border border-zinc-700 rounded flex items-center justify-center text-xs text-zinc-500">
                  <DollarSign size={16} className="text-emerald-500 mr-1"/> Extrato
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-zinc-100 font-semibold mb-1">Billing & Ledger</h3>
              <p className="text-xs text-zinc-400">Componente de split de pagamentos e livro razão por Tenant.</p>
            </div>
          </div>

          {/* Leads Preview */}
          <div className="bg-zinc-900/80 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-colors group">
            <div className="h-40 bg-zinc-800/50 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 opacity-50"></div>
              <div className="w-3/4 h-24 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg flex flex-col p-3 z-10 transform group-hover:scale-105 transition-transform gap-2">
                <div className="h-6 w-full bg-zinc-700/50 rounded flex items-center px-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                  <div className="h-2 w-1/3 bg-zinc-600 rounded"></div>
                </div>
                <div className="h-6 w-full bg-zinc-700/50 rounded flex items-center px-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                  <div className="h-2 w-1/2 bg-zinc-600 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-zinc-100 font-semibold mb-1">Lead Triage Board</h3>
              <p className="text-xs text-zinc-400">Classificação via IA, kanban de prospecção e alerta de urgência.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
