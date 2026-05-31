"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Plus,
    LayoutDashboard,
    Briefcase,
    Users,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    Truck,
    Video,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
    className?: string;
    isSuperAdmin?: boolean;
}

export function Sidebar({ className, isSuperAdmin = false }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Jobs", href: "/jobs", icon: Briefcase },
        { title: "Orçamentos", href: "/proposals", icon: FileText },
        { title: "Clientes", href: "/clients", icon: Users },
        { title: "Fornecedores", href: "/suppliers", icon: Truck },
        { title: "Reuniões", href: "/meetings", icon: Video },
        { title: "Financeiro", href: "/finance", icon: CreditCard },
    ];

    return (
        <motion.div
            initial={{ width: 260 }}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "h-screen bg-white text-slate-900 flex flex-col border-r border-slate-200 relative z-20 flex-shrink-0",
                className
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 z-50 shadow-sm"
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            {/* Logo Section */}
            <div className={cn("p-6 flex items-center h-20", collapsed ? "justify-center px-2" : "")}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                        A
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg tracking-tight text-slate-900"
                        >
                            Agency<span className="text-violet-600">OS</span>
                        </motion.span>
                    )}
                </div>
            </div>

            {/* SUPER ADMIN BACK BUTTON */}
            {isSuperAdmin && (
                <div className={cn("px-4 pb-2", collapsed ? "flex justify-center" : "")}>
                    {!collapsed ? (
                        <Link href="/admin">
                            <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-all text-xs h-8">
                                <ChevronLeft className="mr-1 h-3 w-3" /> Voltar para Admin
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/admin">
                            <Button size="icon" variant="outline" className="h-8 w-8 border-purple-200 text-purple-700 hover:bg-purple-50">
                                <ChevronLeft className="h-3 w-3" />
                            </Button>
                        </Link>
                    )}
                </div>
            )}

            {/* Primary Action Button */}
            <div className={cn("px-4 pb-4", collapsed ? "flex justify-center" : "")}>
                {!collapsed ? (
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 shadow-md transition-all duration-300">
                        <Plus className="mr-2 h-4 w-4" /> Novo Job
                    </Button>
                ) : (
                    <Button size="icon" className="bg-violet-600 hover:bg-violet-700 shadow-md">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator className="bg-slate-100 mx-4 w-auto mb-4" />

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-1 py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    isActive
                                        ? "bg-violet-600 text-white shadow-md font-semibold"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                                {!collapsed && (
                                    <span className="text-base">{item.title}</span>
                                )}
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 h-6 w-1 bg-white rounded-r-full opactiy-50" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* User/Profile Section at Bottom */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Link href="/dashboard/settings" className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 border border-violet-200">
                        AG
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-violet-700 transition-colors">Agência Demo</span>
                            <span className="text-xs text-slate-400">Plano Pro</span>
                        </div>
                    )}
                </Link>
            </div>
        </motion.div>
    );
}
