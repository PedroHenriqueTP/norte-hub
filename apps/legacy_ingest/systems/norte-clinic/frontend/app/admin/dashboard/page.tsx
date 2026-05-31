"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Users, ShieldAlert, Server } from "lucide-react";
import { TenantManagementTable } from "@/components/admin/tenant-management-table";
import { FinancialPerformanceChart } from "@/components/admin/financial-performance-chart";
import { AuditFeed } from "@/components/admin/audit-feed";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Mock Data for Tenants (Keep for table for now, or fetch later)
const MOCK_TENANTS = [
    { id: "tenant_001", name: "Clínica Vida Saudável", plan: "Enterprise", isActive: true, mrr: 1500.00, storageUsed: 450, storageLimit: 1000 },
    { id: "tenant_002", name: "Dr. João Cardio", plan: "Professional", isActive: true, mrr: 850.00, storageUsed: 120, storageLimit: 500 },
    { id: "tenant_003", name: "Pediatria Feliz", plan: "Professional", isActive: false, mrr: 850.00, storageUsed: 480, storageLimit: 500 },
    { id: "tenant_004", name: "Centro Ortopédico", plan: "Enterprise", isActive: true, mrr: 2100.00, storageUsed: 890, storageLimit: 2000 },
    { id: "tenant_005", name: "Dra. Ana Dermato", plan: "Basic", isActive: true, mrr: 350.00, storageUsed: 50, storageLimit: 200 },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In production, use environment variable for API URL
                // Assuming auth token is handled by interceptor or we mock it for now
                // For this demo, let's assume the user is logged in as admin
                // const res = await axios.get("http://localhost:8000/api/v1/admin/stats");
                // setStats(res.data);

                // MOCKING THE FETCH for immediate demo stability without full backend running locally in this agent flow
                // Replace with actual fetch when running full stack
                setTimeout(() => {
                    setStats({
                        financial: {
                            mrr: 45231.89,
                            churn_rate: 2.1,
                            growth_pct: 20.1
                        },
                        system: {
                            status: "Healthy",
                            api_latency: "24ms",
                            database: "Online"
                        },
                        security_alerts: 3
                    });
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8 font-sans text-slate-900">
            {/* 1. Header de Gestão */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Tenants e Infraestrutura</h1>
                    <p className="text-slate-500 font-medium mt-1">Torre de Controle Operacional • v2.4.0</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Período:</span>
                    <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-medium h-9">
                        Últimos 30 Dias
                    </Button>
                </div>
            </div>

            {/* 2. Grid de Métricas SaaS (Cards Superiores) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* MRR */}
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">MRR (Recorrente)</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.financial.mrr || 0)}
                        </div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                            +{stats?.financial.growth_pct}% <span className="text-slate-400 font-normal">vs mês anterior</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Total Tenants */}
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Clínicas</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">142</div>
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 font-medium">
                            +12 <span className="text-slate-400 font-normal">novos tenants</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Health Check */}
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Saúde do Sistema</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">API Latency</span>
                                <span className="font-mono text-emerald-600 font-bold">{stats?.system.api_latency}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[95%]" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                                PostgreSQL: <span className="text-emerald-500 font-bold">{stats?.system.database}</span> • Redis: <span className="text-emerald-500 font-bold">Online</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Alerts */}
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Segurança</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{stats?.security_alerts}</div>
                        <p className="text-xs text-amber-600 mt-1 font-medium">
                            Tentativas de Login Falhas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Área Central (Tabela + Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Base de Clientes Ativa</h2>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs font-semibold">Ver Todos</Button>
                        </div>
                        <TenantManagementTable tenants={MOCK_TENANTS} />
                    </div>
                </div>

                {/* Sidebar: Financial Chart & Logs */}
                <div className="space-y-6">
                    {/* Financial Chart Component */}
                    <div className="h-[320px]">
                        <FinancialPerformanceChart />
                    </div>

                    {/* Audit Feed Component */}
                    <AuditFeed />
                </div>
            </div>
        </div>
    );
}
