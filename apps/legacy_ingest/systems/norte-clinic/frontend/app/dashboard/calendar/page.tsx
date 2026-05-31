"use client"
import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react'

export default function AgendaPage() {
    const [view, setView] = useState('timeGridWeek');

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Cabeçalho Orgânico */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-6 rounded-[2.5rem_1rem] backdrop-blur-md border border-white/20 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <CalendarIcon className="text-primary w-8 h-8" />
                        Agenda Clínica
                    </h1>
                    <p className="text-slate-500 mt-1">Gerencie seus atendimentos e sincronize com seus dispositivos.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full">
                    {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === v ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {v === 'dayGridMonth' ? 'Mês' : v === 'timeGridWeek' ? 'Semana' : 'Dia'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Container do Calendário */}
            <div className="bg-white p-6 rounded-[1.5rem_3rem_1.5rem_3rem] shadow-xl border border-slate-100 overflow-hidden">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={view}
                    // Force view update when state changes if needed, but 'view' prop might not be reactive directly in v6 without using ref API. 
                    // However, commonly standard React usage: key={view} forces re-render or using the API.
                    // Let's try key={view} to ensure immediate switch for now, or trust the prop binding (often requires calRef.getApi().changeView(view))
                    // The user provided code uses `initialView={view}` which only sets it on mount. 
                    // To make it dynamic, we usually need a ref. 
                    // BUT, I will stick EXACTLY to the user code first to respect their input, then fix if it doesn't switch.
                    // Wait, the user code is: initialView={view}. changing 'view' state won't change initialView prop effect after mount.
                    // I'll add `key={view}` to force re-mounting and thus respecting initialView, OR better, use ref API.
                    // User asked to "Apply the code...". I will apply it with a small modification to actually make the view switch work (key={view}).
                    key={view}
                    headerToolbar={false} // Escondemos o padrão para usar o nosso personalizado
                    locale="pt-br"
                    slotMinTime="07:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    height="auto"
                    nowIndicator={true}
                    editable={true}
                    selectable={true}
                    eventClassNames="rounded-lg border-none bg-primary/20 text-primary-dark p-1"
                    dayHeaderClassNames="text-slate-400 font-medium py-4"
                />
            </div>

            {/* Botão Flutuante Orgânico - "Folha" */}
            <button className="fixed bottom-10 right-10 bg-gradient-to-r from-primary to-teal-500 text-white p-5 rounded-[2rem_2rem_0_2rem] shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-110 hover:shadow-[0_25px_50px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center gap-3 z-50 group animate-in zoom-in spin-in-3 duration-500">
                <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-bold text-lg hidden group-hover:block animate-in fade-in slide-in-from-right-2">Nova Consulta</span>
                <span className="absolute inset-0 rounded-[2rem_2rem_0_2rem] ring-4 ring-white/30 animate-ping opacity-20"></span>
            </button>
        </div>
    )
}
