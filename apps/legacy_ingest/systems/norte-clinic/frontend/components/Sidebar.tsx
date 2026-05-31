"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    LayoutDashboard,
    Stethoscope,
    DollarSign,
    ShieldCheck,
    ChevronRight,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
    {
        title: "Atendimento",
        items: [
            { href: "/dashboard", icon: LayoutDashboard, label: "Visão Geral" },
            { href: "/dashboard/calendar", icon: Calendar, label: "Agenda" },
            { href: "/dashboard/patients", icon: Users, label: "Pacientes" },
            { href: "/dashboard/consultations", icon: Stethoscope, label: "Consultas" },
        ]
    },
    {
        title: "Gestão",
        items: [
            { href: "/dashboard/financial", icon: DollarSign, label: "Financeiro" },
            { href: "/dashboard/documents", icon: FileText, label: "Documentos" },
            { href: "/dashboard/chat", icon: MessageSquare, label: "Chat" },
        ]
    },
    {
        title: "Configurações",
        items: [
            { href: "/dashboard/admin/users", icon: ShieldCheck, label: "Admin" },
            { href: "/dashboard/settings", icon: Settings, label: "Ajustes" },
        ]
    }
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "flex flex-col h-full bg-white/80 backdrop-blur-2xl rounded-r-[4rem] mr-4 transition-all duration-300",
            className
        )}>
            {/* 1. Brand Header */}
            <div className="flex items-center gap-3 px-8 h-28">
                <div className="bg-gradient-to-br from-primary to-teal-400 p-3 rounded-2xl shadow-lg shadow-primary/20">
                    <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight text-slate-800">MedCura</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Bio System</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-10">
                {/* 2. Navigation Groups */}
                {navItems.map((group, i) => (
                    <div key={i} className="animate-in slide-in-from-left-4 fade-in duration-700" style={{ animationDelay: `${i * 150}ms` }}>
                        <h4 className="px-6 text-xs font-extrabold text-slate-400 uppercase tracking-[0.4em] mb-4">
                            {group.title.split('').join(' ')}
                        </h4>
                        <div className="space-y-3">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-3xl text-base transition-all duration-300 group",
                                            isActive
                                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold shadow-sm translate-x-1 tracking-wide"
                                                : "text-muted-foreground/80 hover:bg-slate-50 hover:text-foreground hover:translate-x-1 tracking-wide"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-7 w-7 !stroke-[2.5] transition-colors duration-300",
                                            isActive ? "text-primary" : "text-slate-400 group-hover:text-primary/70"
                                        )} />
                                        {item.label}
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. User Profile Footer */}
            <div className="p-6 mt-auto">
                <div className="organic-card p-4 flex items-center gap-3 bg-white/50 border-white/40 hover:bg-white/80 cursor-pointer group">
                    <Avatar className="h-10 w-10 border border-white shadow-sm group-hover:scale-105 transition-transform">
                        <AvatarImage src="/avatars/01.png" alt="Dr. Pedro" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-400 text-white font-bold">PH</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">Dr. Pedro</span>
                        <span className="text-xs text-muted-foreground truncate">Cardiologista</span>
                    </div>
                    <LogOut className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-red-400 transition-colors" />
                </div>
            </div>
        </div>
    );
}
