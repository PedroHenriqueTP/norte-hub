"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Patient {
    id: string;
    name: string;
    lastAppointment?: string;
    avatar?: string;
    condition?: string;
}

interface PatientSelectorProps {
    patients: Patient[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function PatientSelector({ patients, selectedId, onSelect }: PatientSelectorProps) {
    const [search, setSearch] = useState("");

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden">
            <div className="p-6 bg-white/40 border-b border-white/20">
                <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Pacientes</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar paciente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white/80 border-none h-12 rounded-2xl shadow-sm focus-visible:ring-primary/20"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                    {filtered.map((patient) => (
                        <button
                            key={patient.id}
                            onClick={() => onSelect(patient.id)}
                            className={cn(
                                "w-full p-4 flex items-center gap-4 rounded-[20px] transition-all duration-300 group text-left",
                                selectedId === patient.id
                                    ? "bg-gradient-to-r from-primary to-teal-400 text-white shadow-lg shadow-primary/25 scale-[1.02]"
                                    : "hover:bg-white/60 text-slate-600 hover:scale-[1.01]"
                            )}
                        >
                            <Avatar className={cn(
                                "h-12 w-12 border-2 transition-colors",
                                selectedId === patient.id ? "border-white/30" : "border-white"
                            )}>
                                <AvatarImage src={patient.avatar} />
                                <AvatarFallback className={cn(
                                    selectedId === patient.id ? "text-primary bg-white" : "text-slate-500 bg-slate-100"
                                )}>
                                    {patient.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "font-bold text-base truncate",
                                    selectedId === patient.id ? "text-white" : "text-slate-800"
                                )}>
                                    {patient.name}
                                </p>
                                <p className={cn(
                                    "text-xs truncate opacity-80",
                                    selectedId === patient.id ? "text-white" : "text-slate-500"
                                )}>
                                    {patient.condition || "Sem comorbidades"}
                                </p>
                            </div>
                        </button>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            Nenhum paciente encontrado.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
