"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FlaskConical, Pill, FileText, CheckCircle2, ChevronDown, Calendar, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
    id: string;
    date: string;
    type: string;
    diagnosis?: string;
    prescription?: string;
    status: string;
    description?: string;
}

export function BioTimeline({ events, isLoading }: { events: TimelineEvent[], isLoading: boolean }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (isLoading) return <BioSkeletonLoader />;
    if (!events.length) return <EmptyState />;

    return (
        <div className="relative pl-8 pr-4 py-8 h-full overflow-y-auto custom-scrollbar">
            {/* Organic Line - SVG Sinuous Path background */}
            <div className="absolute left-[39px] top-0 bottom-0 w-1 pointer-events-none">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent dashed-line" />
            </div>

            <div className="space-y-12">
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Node */}
                        <div
                            className={cn(
                                "absolute left-[calc(-2rem-5px)] top-0 w-6 h-6 rounded-full border-4 border-white transition-all duration-500 z-10 cursor-pointer shadow-md",
                                expandedId === event.id ? "bg-primary scale-125 shadow-primary/40" : "bg-slate-200 hover:bg-primary/50"
                            )}
                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                        />

                        {/* Content Card */}
                        <div
                            className={cn(
                                "organic-card group cursor-pointer transition-all duration-500 border-none bg-white/60 hover:bg-white/80",
                                expandedId === event.id ? "shadow-2xl ring-1 ring-primary/20 bg-white" : "shadow-sm hover:shadow-md"
                            )}
                            onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-primary tracking-widest uppercase flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {format(parseISO(event.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </span>
                                        <h3 className="text-xl font-bold text-slate-800 mt-1">{event.type}</h3>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                                        event.status === "Concluída" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                    )}>
                                        {event.status}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedId === event.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Diagnosis Capsule */}
                                                <div className="bg-blue-50/50 p-4 rounded-[20px] border border-blue-100">
                                                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm uppercase">
                                                        <Activity className="w-4 h-4" /> Diagnóstico
                                                    </div>
                                                    <p className="text-slate-700 leading-relaxed font-medium">
                                                        {event.diagnosis || "Não registrado."}
                                                    </p>
                                                </div>

                                                {/* Prescription Capsule */}
                                                <div className="bg-emerald-50/50 p-4 rounded-[20px] border border-emerald-100">
                                                    <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm uppercase">
                                                        <Pill className="w-4 h-4" /> Prescrição
                                                    </div>
                                                    <p className="text-slate-700 leading-relaxed font-medium">
                                                        {event.prescription || "Não registrada."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                                                    <FileText className="w-3 h-3" /> Ver Exames Anexados
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {expandedId !== event.id && (
                                    <div className="mt-2 text-slate-400 text-sm flex items-center justify-center">
                                        <ChevronDown className="w-4 h-4 animate-bounce opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function BioSkeletonLoader() {
    return (
        <div className="space-y-8 p-8 relative">
            <div className="absolute left-[39px] top-0 bottom-0 w-0.5 bg-slate-100" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="pl-8 relative">
                    {/* Organic Pulse Blob */}
                    <div className="absolute left-[-5px] top-0 w-6 h-6 bg-slate-200 rounded-full animate-pulse" />
                    <div className="h-40 bg-slate-50 rounded-[30px] w-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <FlaskConical className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Selecione um paciente para ver a linha do tempo.</p>
        </div>
    );
}
