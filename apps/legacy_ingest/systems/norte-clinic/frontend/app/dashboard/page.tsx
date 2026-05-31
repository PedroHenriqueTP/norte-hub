"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Calendar, ClipboardList, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FinancialTrendChart } from "@/components/FinancialTrendChart";
import { BioAvatar } from "@/components/BioAvatar";

export default function DashboardPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const res = await api.get("/dashboard/stats");
            return res.data;
        }
    });

    if (error) {
        return (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-3xl border border-red-100">
                Erro ao carregar dados do dashboard. Verifique sua conexão.
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* 1. Greeting Section (Bio-Design) */}
            {/* 1. Greeting Section (Bio-Design & Intelligent Reception) */}
            <div className="pl-2 relative flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                        {stats?.total_appointments_future && stats.total_appointments_future > 10 ? (
                            <>Dia intenso, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Dr. Gabriel</span>!</>
                        ) : (
                            <>Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Dr. Gabriel</span>!</>
                        )}
                    </h1>
                    <p className="text-slate-500 text-xl mt-3 font-medium tracking-wide flex items-center gap-3">
                        {stats?.total_appointments_future && stats.total_appointments_future > 10 ? (
                            <>Gostaria que eu priorizasse os <span className="font-bold text-secondary text-2xl">casos complexos</span>?</>
                        ) : (
                            <>Sua jornada hoje inclui <span className="font-bold text-secondary text-2xl">{stats?.total_appointments_future || 8} vidas</span> para cuidar.</>
                        )}
                    </p>
                </div>

                {/* Bio-Organic Avatar Integration */}
                <div className="hidden md:flex flex-col items-center gap-2 mr-8">
                    <BioAvatar
                        state={stats?.total_appointments_future && stats.total_appointments_future > 10 ? "busy" : "idle"}
                        size="lg"
                    />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        {stats?.total_appointments_future && stats.total_appointments_future > 10 ? "Modo Foco" : "Recepção"}
                    </span>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. Total Pacientes */}
                <div className="organic-card p-8 flex flex-col justify-between h-[220px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-500 uppercase tracking-wider">Pacientes</h3>
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {isLoading ? (
                                <Skeleton className="h-12 w-24 rounded-xl" />
                            ) : (
                                <div className="text-5xl font-bold text-slate-800 tracking-tighter">{stats?.total_patients || 0}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* Sparkline decoration */}
                        <svg className="absolute bottom-0 left-0 w-full h-16 text-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 L0 10 Q 25 20 50 10 T 100 5 V 20 Z" fill="currentColor" />
                        </svg>
                        <p className="text-sm font-medium text-slate-400 flex items-center gap-2 relative z-10">
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">+2 novos</span>
                            esta semana
                        </p>
                    </div>
                </div>

                {/* 2. Agendamentos Futuros */}
                <div className="organic-card p-8 flex flex-col justify-between h-[220px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-500 uppercase tracking-wider">Agenda</h3>
                            <div className="p-3 bg-teal-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {isLoading ? (
                                <Skeleton className="h-12 w-24 rounded-xl" />
                            ) : (
                                <div className="text-5xl font-bold text-slate-800 tracking-tighter">{stats?.total_appointments_future || 0}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* Sparkline decoration */}
                        <svg className="absolute bottom-0 left-0 w-full h-16 text-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 L0 15 Q 30 5 60 12 T 100 8 V 20 Z" fill="currentColor" />
                        </svg>
                        <p className="text-sm font-medium text-slate-400 relative z-10">
                            Confirmados no sistema
                        </p>
                    </div>
                </div>

                {/* 3. Consultas Realizadas */}
                <div className="organic-card p-8 flex flex-col justify-between h-[220px] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-slate-500 uppercase tracking-wider">Realizados</h3>
                            <div className="p-3 bg-purple-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <ClipboardList className="h-8 w-8 text-purple-500" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {isLoading ? (
                                <Skeleton className="h-12 w-24 rounded-xl" />
                            ) : (
                                <div className="text-5xl font-bold text-slate-800 tracking-tighter">{stats?.total_consultations_past || 0}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        {/* Sparkline decoration */}
                        <svg className="absolute bottom-0 left-0 w-full h-16 text-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 20 L0 18 Q 40 2 80 14 T 100 10 V 20 Z" fill="currentColor" />
                        </svg>
                        <p className="text-sm font-medium text-slate-400 relative z-10">
                            Histórico total
                        </p>
                    </div>
                </div>

                {/* 4. Próximo Agendamento */}
                <div className="organic-card p-0 flex flex-col h-[220px] relative overflow-hidden group border-l-8 border-l-blue-500 hover:shadow-2xl transition-all duration-500">
                    <div className="p-8 h-full flex flex-col justify-between relative z-10 bg-white/50 hover:bg-white/80 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-base font-semibold text-slate-500 uppercase tracking-wider">Próximo</h3>
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3 mt-4">
                                <Skeleton className="h-8 w-40 rounded-lg" />
                                <Skeleton className="h-6 w-32 rounded-lg" />
                            </div>
                        ) : stats?.next_appointment ? (
                            <div className="mt-2">
                                <div className="text-2xl font-bold text-slate-800 truncate leading-snug" title={stats.next_appointment.patient_name}>
                                    {stats.next_appointment.patient_name}
                                </div>
                                <div className="text-lg font-medium text-blue-600 mt-1">
                                    {format(new Date(stats.next_appointment.start_time), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                </div>
                                <span className="text-xs uppercase font-extrabold text-blue-500 bg-blue-100/50 px-3 py-1 rounded-full mt-4 inline-block tracking-widest">
                                    {stats.next_appointment.status || "CONFIRMADO"}
                                </span>
                            </div>
                        ) : (
                            <div className="text-lg text-slate-400 mt-4 font-medium">
                                Sem agendamentos hoje
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Financial Insight Section */}
            <div className="grid gap-8 grid-cols-1 h-[400px]">
                <FinancialTrendChart />
            </div>
        </div>
    );
}
