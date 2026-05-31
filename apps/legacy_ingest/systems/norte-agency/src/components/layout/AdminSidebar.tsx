"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Building2,
    Webhook,
    ChevronLeft,
    ChevronRight,
    Search,
    Layers,
    Presentation,
    Rocket,
    Grid3X3,
    Store,
    GraduationCap,
    Target,
    Activity,
    BrainCircuit,
    Megaphone,
    Radio,
    UploadCloud,
    Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface AdminSidebarProps {
    className?: string;
    brandName?: string;
    primaryColor?: string;
}

export function AdminSidebar({ 
    className, 
    brandName = "AgencyOS", 
    primaryColor = "#8b5cf6" 
}: AdminSidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { title: "Gateway (Core)", href: "/main-hub", icon: BrainCircuit },
        { title: "Meus Projetos", href: "/admin/projects", icon: Server },
        { title: "SaaS Maker", href: "/admin/studio", icon: Wand2 },
        { title: "Financeiro (Hub)", href: "/admin/finances", icon: DollarSign },
        { title: "Financeiro", href: "/admin/finance", icon: CreditCard },
        { title: "Livraria", href: "/admin/library", icon: Layers },
        { title: "Hub", href: "/admin/hub", icon: Webhook },
        { title: "Tenants", href: "/admin/tenants", icon: Building2 },
        { title: "Billing", href: "/admin/billing", icon: CreditCard },
        { title: "Norte Pitch", href: "/admin/presentations", icon: Presentation },
        { title: "DNA Showcase", href: "/admin/showcase", icon: Rocket },
        { title: "Norte Canvas", href: "/admin/designer", icon: Grid3X3 },
        { title: "Marketplace Hub", href: "/admin/marketplaces/analytics", icon: Store },
        { title: "InfoHub (EdTech)", href: "/admin/infohub/designer", icon: GraduationCap },
        { title: "Afiliados (Exército)", href: "/admin/affiliates/dashboard", icon: Target },
        { title: "Norte Stream (Feed)", href: "/admin/feed", icon: Radio },
        { title: "Omni-Drop Portal", href: "/admin/omni", icon: UploadCloud },
        { title: "Performance & Bio", href: "/admin/performance", icon: Activity },
        { title: "Norte Intelligence", href: "/admin/intelligence", icon: BrainCircuit },
        { title: "Social & Ads Hub", href: "/admin/social", icon: Megaphone },
        { title: "Leads (CRM)", href: "/admin/leads", icon: Search },
    ];

    return (
        <motion.div
            initial={{ width: 260 }}
            animate={{ width: collapsed ? 80 : 260 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 relative z-20 flex-shrink-0",
                className
            )}
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 z-50 shadow-md"
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            {/* Logo Section */}
            <div className={cn("p-6 flex items-center h-20", collapsed ? "justify-center px-2" : "")}>
                <div className="flex items-center gap-2">
                    <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shrink-0"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {brandName.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-lg tracking-tight flex items-center gap-2"
                        >
                            {brandName} <span className="font-normal" style={{ color: primaryColor }}>Hub</span>
                        </motion.span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-purple-500/10 text-purple-400"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300")} />
                                {!collapsed && (
                                    <span>{item.title}</span>
                                )}
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 h-full w-1 bg-purple-500 rounded-r-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* User/Profile Section */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 group">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-300 border border-slate-600">
                        SA
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-200">Super Admin</span>
                            <span className="text-xs text-slate-500">System Owner</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
