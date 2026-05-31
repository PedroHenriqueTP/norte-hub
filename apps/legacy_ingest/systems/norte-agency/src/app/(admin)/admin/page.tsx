"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    CreditCard,
    Activity,
    ArrowUpRight,
    ExternalLink,
    Search,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { getSuperAdminStats } from "@/actions/jobs";

// --- TYPES representing the real data structure ---
type StartData = {
    totalTenants: number;
    totalUsers: number;
    globalMRR: string;
};

const TENANT_STATUS = {
    generated: 45,    // Mocked for now until we have real Tenant Status tracking
    active: 32,
    churned: 8,
    abandoned: 5
};

const RECENT_TRANSACTIONS = [
    // Mocked for now - requires Transaction Service update for Global latest
    { id: 1, agency: "Rocket Mkt", amount: 299.00, status: "success", date: "Hoje, 10:42" },
    { id: 2, agency: "Agência Voo", amount: 499.00, status: "success", date: "Hoje, 09:15" },
    { id: 3, agency: "Design Pro", amount: 299.00, status: "failed", date: "Ontem, 18:00" },
];

const TENANTS_LIST = [
    // Mocked for now - requires Tenant Listing Action
    { id: 1, name: "Rocket Marketing", domain: "rocket.agencyos.com", plan: "Pro", status: "active" },
    { id: 2, name: "Studio Alpha", domain: "alpha.agencyos.com", plan: "Starter", status: "warning" },
    { id: 3, name: "Blue Ocean", domain: "blue.agencyos.com", plan: "Enterprise", status: "active" },
    { id: 4, name: "Drop Store", domain: "drop.agencyos.com", plan: "Starter", status: "inactive" },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState<StartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getSuperAdminStats();
                setStats({
                    totalTenants: data.totalTenants,
                    totalUsers: data.totalUsers,
                    globalMRR: data.globalMRR
                });
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Carregando dados em tempo real...</div>;
    }

    return (
        <div className="p-6 space-y-8 text-slate-900">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Visão Geral (Super Admin)</h1>
                    <p className="text-slate-500">Monitoramento global do AgencyOS</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Sistema Operacional
                    </span>
                </div>
            </div>

            {/* 1. CARDS DE KPI & ATIVIDADE REAL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card Usuários Ativos (Total Users DB) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Usuários Registrados</p>
                            <h3 className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                {/* Card Tenants Totais */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Tenants Totais</p>
                            <h3 className="text-3xl font-bold mt-2">{stats?.totalTenants || 0}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Building2 size={20} />
                        </div>
                    </div>
                </div>

                {/* Card Financeiro MRR */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">MRR Global (Estimado)</p>
                            <h3 className="text-3xl font-bold mt-2">R$ {parseFloat(stats?.globalMRR || "0").toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <CreditCard size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 flex items-center">
                        <ArrowUpRight size={14} className="mr-1" /> Baseado em transações reais
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 2. PAINEL DE NAVEGAÇÃO ENTRE TENANTS (GOD MODE) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Gerenciamento de Tenants</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar agência..."
                                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-5 py-3">Agência</th>
                                    <th className="px-5 py-3">Domínio</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {TENANTS_LIST.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-5 py-4 font-medium text-slate-900">{tenant.name}</td>
                                        <td className="px-5 py-4 text-slate-500">{tenant.domain}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    tenant.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}
                      `}>
                                                {tenant.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="text-purple-600 hover:text-purple-800 text-xs font-bold border border-purple-200 px-3 py-1 rounded hover:bg-purple-50 transition-all flex items-center gap-1 ml-auto">
                                                Acessar Painel <ExternalLink size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl text-center">
                        <button className="text-slate-500 text-sm hover:text-purple-600 font-medium">Ver todos os tenants</button>
                    </div>
                </div>

                {/* 3. MONITORAMENTO FINANCEIRO (RESUMO) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Transações Recentes</h3>
                    </div>
                    <div className="p-2">
                        {RECENT_TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {tx.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{tx.agency}</p>
                                        <p className="text-xs text-slate-500">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">R$ {tx.amount}</p>
                                    <p className="text-xs text-slate-400">Assinatura</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-100 text-center">
                        <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                            Ver Relatório Financeiro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
