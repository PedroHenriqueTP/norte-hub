"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    CreditCard,
    Truck,
    LogOut,
    Settings,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface TenantNavbarProps {
    className?: string;
    isSuperAdmin?: boolean; // To show "Back to Admin" if needed, though usually distinct apps
}

export function TenantNavbar({ className, isSuperAdmin }: TenantNavbarProps) {
    const pathname = usePathname();

    const navItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Jobs", href: "/jobs", icon: Briefcase },
        { title: "Clientes", href: "/clients", icon: Users },
        { title: "Fornecedores", href: "/suppliers", icon: Truck },
        { title: "Financeiro", href: "/finance", icon: CreditCard },
    ];

    return (
        <header className={cn("sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60", className)}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
                            A
                        </div>
                        <span className="font-bold text-lg tracking-tight text-foreground">
                            Agency<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">OS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-violet-400" : "text-muted-foreground group-hover:text-foreground")} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {isSuperAdmin && (
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="hidden md:flex border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                                Voltar para Admin
                            </Button>
                        </Link>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 ml-auto hover:bg-white/5">
                                <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-300 border border-violet-500/30">
                                    AG
                                </div>
                                <div className="flex flex-col items-start text-xs hidden sm:flex">
                                    <span className="font-bold text-foreground">Agência Demo</span>
                                    <span className="text-muted-foreground">Plano Pro</span>
                                </div>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 glass-card text-foreground">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" /> Configurações
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer" onClick={() => signOut()}>
                                <LogOut className="mr-2 h-4 w-4" /> Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
