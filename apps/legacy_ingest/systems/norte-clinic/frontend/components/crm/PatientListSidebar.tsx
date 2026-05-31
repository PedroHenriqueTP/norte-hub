"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

// Mock Data for visualization
const MOCK_PATIENTS = [
    { id: "1", name: "Maria Silva", status: "Retorno", lastSeen: "2 dias atrás" },
    { id: "2", name: "João Santos", status: "Em tratamento", lastSeen: "Hoje" },
    { id: "3", name: "Ana Costa", status: "Alta", lastSeen: "1 mês atrás" },
    { id: "4", name: "Pedro Oliveira", status: "Retorno Pendente", lastSeen: "5 dias atrás" },
    { id: "5", name: "Carla Souza", status: "Novo", lastSeen: "Hoje" },
];

export function PatientListSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentId = searchParams.get("patient_id");
    const [filter, setFilter] = useState("");

    const handleSelect = (id: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("patient_id", id);
        router.push(`?${params.toString()}`);
    };

    const filteredPatients = MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            {/* Header / Search */}
            <div className="p-4 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-800 text-sm tracking-tight uppercase">Pacientes</h2>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por nome..."
                        className="pl-9 h-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {filteredPatients.map((patient) => (
                        <button
                            key={patient.id}
                            onClick={() => handleSelect(patient.id)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg text-sm transition-all flex items-start gap-3 group border border-transparent",
                                currentId === patient.id
                                    ? "bg-blue-50 border-blue-100 ring-1 ring-blue-200"
                                    : "hover:bg-slate-50 hover:border-slate-100"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-black/5",
                                currentId === patient.id ? "bg-blue-200 text-blue-700" : "bg-slate-200 text-slate-500"
                            )}>
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <span className={cn("font-medium truncate", currentId === patient.id ? "text-blue-900" : "text-slate-700")}>
                                        {patient.name}
                                    </span>
                                    {currentId === patient.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-slate-500 truncate">{patient.status}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{patient.lastSeen}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
