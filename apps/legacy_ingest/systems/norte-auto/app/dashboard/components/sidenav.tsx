"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Package,
    ShoppingBag,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SyncStatus } from "./sync-status";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { signOut } from "next-auth/react"; // Use client-side signOut for interactive elements if strictly client component

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Produtos", href: "/dashboard/products", icon: Package },
    { label: "Pedidos", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Financeiro", href: "/dashboard/financial", icon: BarChart3 },
    { label: "Configurações", href: "/dashboard/settings", icon: Settings },
];

interface SideNavProps {
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
    isMobile?: boolean; // If rendered inside a Sheet
}

export function SideNavContent({ isCollapsed, isMobile }: SideNavProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col gap-4">
            <div className={cn("flex h-[60px] items-center px-6", isCollapsed ? "justify-center px-2" : "")}>
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Package className="h-5 w-5" />
                    </div>
                    {!isCollapsed && <span className="">OmniSync</span>}
                </Link>
            </div>

            <div className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            <div className="px-4 mt-auto space-y-4 mb-4">
                {/* Sync Status - Hide text if collapsed, keep dot maybe? Or just hide for simplicity in strict collapse */}
                {!isCollapsed && <SyncStatus />}

                <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-2")}
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && "Sair"}
                </Button>
            </div>
        </div>
    );
}

export default function SideNav() {
    // This component is now just the Desktop wrapper logic if needed, 
    // or we can handle `isCollapsed` state in the layout.
    // For now, let's keep it simple and assume standard responsive behavior handled by Layout
    return null;
}
