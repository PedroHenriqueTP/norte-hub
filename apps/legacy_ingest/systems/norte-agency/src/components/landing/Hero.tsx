"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Background Glow Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-violet-600/30 blur-[120px] rounded-full pointer-events-none"
            />

            <div className="container mx-auto px-4 relative z-10 text-center">

                {/* Staggered Text Animations */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                        AgencyOS v1.0 is now live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
                    >
                        O Sistema Operacional da sua <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 animate-gradient-x">
                            Agência Criativa
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Deixe o caos das planilhas. Abrace a gestão financeira por Job,
                        Inteligência Artificial e um Marketplace de Talentos integrado.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full text-base font-semibold group transition-all hover:scale-105">
                            Começar Agora
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/10 text-white hover:bg-white/5 backdrop-blur-sm transition-all hover:scale-105">
                            <PlayCircle className="mr-2 w-4 h-4" />
                            Ver Demo
                        </Button>
                    </motion.div>
                </div>

                {/* 3D Dashboard Preview with Floating Animation */}
                <motion.div
                    initial={{ opacity: 0, rotateX: 20, y: 100 }}
                    animate={{ opacity: 1, rotateX: 20, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, type: "spring" }}
                    style={{ perspective: "1000px" }}
                    className="relative max-w-5xl mx-auto"
                >
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl p-2"
                    >
                        {/* Mockup Image Placeholder */}
                        <div className="aspect-[16/9] rounded-lg bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 opacity-50" />

                            {/* Simulated UI Content */}
                            <div className="absolute inset-0 p-8 flex flex-col gap-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="flex gap-4">
                                    <div className="w-1/4 h-32 bg-white/5 rounded-lg animate-pulse" />
                                    <div className="w-1/4 h-32 bg-white/5 rounded-lg animate-pulse delay-100" />
                                    <div className="w-1/4 h-32 bg-white/5 rounded-lg animate-pulse delay-200" />
                                    <div className="w-1/4 h-32 bg-white/5 rounded-lg animate-pulse delay-300" />
                                </div>
                                <div className="flex-1 bg-white/5 rounded-lg w-full animate-pulse delay-500" />
                            </div>

                            <div className="text-zinc-500 font-mono text-sm relative z-10 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                Dashboard Interface Preview
                            </div>

                            {/* Decorative UI elements */}
                            <div className="absolute top-4 left-4 right-4 h-8 bg-zinc-800/50 rounded flex items-center px-3 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Glow under the dashboard */}
                    <div className="absolute -bottom-10 left-10 right-10 h-20 bg-violet-500/20 blur-[60px] rounded-full z-[-1]" />
                </motion.div>
            </div>
        </section>
    );
}
