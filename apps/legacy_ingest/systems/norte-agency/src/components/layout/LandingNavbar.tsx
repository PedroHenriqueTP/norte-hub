"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNavbar({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false);
    const isLoggedIn = !!user;
    const dashboardLink = user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? "bg-black/50 backdrop-blur-md border-white/10" : "bg-transparent border-transparent"
                }`}
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">AgencyOS</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#workflow" className="hover:text-white transition-colors">Workflow</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <span className="text-zinc-400 text-sm hidden md:block">
                                Ola, {user.name}
                            </span>
                            <Link href={dashboardLink}>
                                <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
                                    Ir para Dashboard
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button className="rounded-full bg-white text-black hover:bg-zinc-200">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
