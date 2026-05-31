"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, DollarSign, Settings, LogOut, Activity, ArrowLeft } from "lucide-react";

const adminNavItems = [
    { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/admin/users", label: "Usuários", icon: Users },
    { href: "/admin/finance", label: "Financeiro", icon: DollarSign },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-slate-950 text-slate-100 md:block w-72 min-h-screen shadow-xl">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-20 items-center border-b border-slate-900 px-6 bg-red-950/20">
                    <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span>Admin Painel</span>
                    </div>
                </div>
                <div className="flex-1 py-6">
                    <nav className="grid items-start px-4 text-sm font-medium space-y-2">
                        {adminNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 group",
                                    pathname === item.href
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/25"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                <span className="text-base">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-slate-900 space-y-2">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-400 transition-all hover:text-emerald-400 hover:bg-slate-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-base font-medium">Voltar ao App</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-slate-400 transition-all hover:text-red-400 hover:bg-slate-900"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-base font-medium">Sair</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
