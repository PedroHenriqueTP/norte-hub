"use client";

import { Suspense } from "react";
import { PatientListSidebar } from "@/components/crm/PatientListSidebar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Activity, Calendar, CreditCard, FileText } from "lucide-react";

// Placeholder for the 360 View Detail Component
function PatientDetailView() {
    const searchParams = useSearchParams();
    const id = searchParams.get("patient_id");

    if (!id) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium">Selecione um paciente para visualizar o prontuário.</p>
            </div>
        );
    }

    return (
        <div className="p-8 h-full overflow-y-auto bg-[#F8F9FA/50]">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-slate-200 border-4 border-white shadow-sm flex items-center justify-center text-slate-400 text-2xl font-bold">
                        {/* Avatar Placeholder */}
                        MS
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Maria Silva</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Convênio Unimed
                            </span>
                            <span className="font-mono">ID: {id}</span>
                            <span>34 anos</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Última Consulta</div>
                        <div className="font-mono text-sm text-slate-700">14 OUT 2023</div>
                    </div>
                </div>
            </div>

            {/* 360 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Financeiro */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded">Em dia</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">R$ 450,00</div>
                    <p className="text-xs text-slate-500">Próximo vencimento: 15/11</p>
                </div>

                {/* Agenda */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded">Retorno</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900 mb-1">24 NOV</div>
                    <p className="text-xs text-slate-500">14:00 - Presencial</p>
                </div>

                {/* Documentos */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">3 arquivos</span>
                    </div>
                    <div className="font-medium text-slate-900 mb-1 truncate">Hemograma Completo</div>
                    <p className="text-xs text-slate-500">Adicionado há 2 dias</p>
                </div>
            </div>

            {/* Timeline Placeholder */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[300px]">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-slate-400" />
                    Linha do Tempo Recente
                </h3>
                <div className="space-y-6 pl-2 border-l-2 border-slate-100 ml-2">
                    <div className="relative pl-6">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-slate-900">Consulta de Rotina</p>
                            <span className="text-xs text-slate-400 font-mono">14 OUT</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Queixa principal: Cefaleia tensional. Prescrito Dipirona.</p>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-slate-900">Exames Laboratoriais</p>
                            <span className="text-xs text-slate-400 font-mono">10 OUT</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Resultados importados: Colesterol total.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export default function PatientsCRMPage() {
    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex">
            {/* Left Sidebar */}
            <div className="w-[320px] shrink-0 h-full">
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                    <PatientListSidebar />
                </Suspense>
            </div>

            {/* Main Content (360 View) */}
            <div className="flex-1 h-full bg-[#FAFAFA]">
                <Suspense fallback={<div className="p-8"><Skeleton className="h-40 w-full mb-4" /><Skeleton className="h-64 w-full" /></div>}>
                    <PatientDetailView />
                </Suspense>
            </div>
        </div>
    );
}
