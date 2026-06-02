"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LogOut,
    LayoutDashboard,
    Timer,
    ShoppingBag,
    LayoutGrid,
    Utensils,
    Package,
    Users,
    Shield,
    DollarSign,
    Settings
} from 'lucide-react';

const navItems = [
    { label: "Visão Geral", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Fila de Espera", icon: Timer, href: "/waiting-list" },
    { label: "Delivery", icon: ShoppingBag, href: "/orders" },
    { label: "Mesas", icon: LayoutGrid, href: "/tables" },
    { label: "Cardápio", icon: Utensils, href: "/menu" },
    { label: "Estoque", icon: Package, href: "/inventory" },
    { label: "Clientes", icon: Users, href: "/customers" },
    { label: "Equipe", icon: Shield, href: "/team" },
    { label: "Financeiro", icon: DollarSign, href: "/finance" },
    { label: "Integrações", icon: Settings, href: "/integrations" },
];

export function AdminHeader() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 h-24 bg-white border-b border-gray-100 z-50 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center gap-12">
                <Link href="/dashboard" className="text-3xl font-bold tracking-tight">
                    Delivery<span className="text-primary">Platform</span>
                </Link>

                <nav className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span>Sair</span>
                </button>
            </div>
        </header>
    );
}
