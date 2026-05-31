"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BioTimeline } from "@/components/BioTimeline";
import { PatientSelector } from "@/components/PatientSelector";
import { Plus } from "lucide-react";

type Consultation = {
    id: string;
    patient_name: string;
    patient_id: string;
    date: string; // ISO
    type: string; // "Presencial", "Teleconsulta"
    status: "Concluída" | "Pendente" | "Cancelada";
    diagnosis?: string;
    prescription?: string;
};

// Extracted mock patient data derivation for now, can be replaced by real API call to /patients
// This respects the "Otimização de Carregamento" by deduping existing data first
const derivePatients = (consultations: Consultation[]) => {
    const patientsMap = new Map();
    consultations.forEach(c => {
        if (!patientsMap.has(c.patient_id)) {
            patientsMap.set(c.patient_id, {
                id: c.patient_id,
                name: c.patient_name,
                // In a real scenario, avatar and condition would come from the patient record
                avatar: undefined,
                condition: c.diagnosis ? c.diagnosis : "Acompanhamento Regular"
            });
        }
    });
    return Array.from(patientsMap.values());
};

export default function ConsultationsPage() {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const { data: consultations = [], isLoading } = useQuery<Consultation[]>({
        queryKey: ["consultations"],
        queryFn: async () => {
            const res = await api.get("/consultations");
            return res.data;
        },
    });

    const patients = useMemo(() => derivePatients(consultations), [consultations]);

    // Auto-select first patient if none selected and data available
    // This helps the "Bio-Timeline" feel alive immediately
    useMemo(() => {
        if (!selectedPatientId && patients.length > 0) {
            setSelectedPatientId(patients[0].id);
        }
    }, [patients, selectedPatientId]);

    const filteredEvents = useMemo(() => {
        if (!selectedPatientId) return [];
        return consultations
            .filter(c => c.patient_id === selectedPatientId)
            .map(c => ({
                id: c.id,
                date: c.date,
                type: c.type,
                diagnosis: c.diagnosis,
                prescription: c.prescription,
                status: c.status,
                description: `Consulta ${c.type}`
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [consultations, selectedPatientId]);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            {/* Header with Title and New Button */}
            {/* Header */}
            <div className="px-2 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Linha do Tempo Clínica</h1>
                <p className="text-slate-500 font-medium tracking-tight">Registro Contínuo e Histórico Evolutivo</p>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
                {/* Left Column: Patient Selector & Filters (30%) */}
                <div className="lg:col-span-4 xl:col-span-3 h-full flex flex-col gap-4">
                    {/* Search/Filter for Timeline */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Filtrar Histórico</label>
                        <div className="relative">
                            <Plus className="absolute left-3 top-3 w-4 h-4 text-slate-300 rotate-45" />
                            {/* Using Plus rotated as placeholder for Search icon if Search not imported, but I will import Search */}
                            <input
                                type="text"
                                placeholder="Buscar (ex: Hipertensão)..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <PatientSelector
                        patients={patients}
                        selectedId={selectedPatientId}
                        onSelect={setSelectedPatientId}
                    />
                </div>

                {/* Right Column: Active Clinical Area (70%) */}
                <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col gap-6 overflow-y-auto pr-2 pb-10">

                    {/* 1. New Consultation "Focus Mode" Block */}
                    {selectedPatientId && (
                        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-all" />

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Nova Consulta</h2>
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registro de Atendimento Atual</p>
                                    </div>
                                </div>
                                <Button className="bg-slate-900 text-white rounded-xl px-4 py-2 h-auto text-xs font-semibold hover:bg-slate-800">
                                    Expandir Anamnese
                                </Button>
                            </div>

                            {/* Compact Form Placeholder */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Queixa Principal</label>
                                    <textarea
                                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none placeholder:text-slate-400"
                                        placeholder="Descreva os sintomas..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">Diagnóstico / Hipótese</label>
                                    <textarea
                                        className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none placeholder:text-slate-400"
                                        placeholder="CID ou observações..."
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button variant="ghost" className="text-slate-500 hover:text-slate-700">Salvar Rascunho</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">Finalizar Atendimento</Button>
                            </div>
                        </div>
                    )}

                    {/* 2. Timeline Feed */}
                    <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white/60 relative overflow-hidden flex-1 min-h-[500px]">
                        {/* Background decorative blob */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

                        {!selectedPatientId ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 flex-col py-20">
                                <p>Selecione um paciente para iniciar.</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        Histórico Clínico
                                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{filteredEvents.length}</span>
                                    </h3>
                                </div>
                                <BioTimeline events={filteredEvents} isLoading={isLoading} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Drop FAB Overlay (Fixed Position) as requested by user roadmap Phase 4 */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    className="w-16 h-16 rounded-br-[40px] rounded-tl-[40px] rounded-tr-[50%] rounded-bl-[50%] bg-gradient-to-br from-teal-400 to-blue-500 shadow-[0_10px_30px_rgba(20,184,166,0.4)] hover:shadow-[0_20px_40px_rgba(20,184,166,0.5)] hover:scale-110 transition-all duration-500 flex items-center justify-center border-4 border-white/20"
                    title="Ação Rápida"
                >
                    <Plus className="w-8 h-8 text-white stroke-[3px]" />
                </Button>
            </div>
        </div>
    );
}
