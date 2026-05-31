"use client";

import { motion } from "framer-motion";
import { Bot, DollarSign, Mic, Briefcase, Layers, Truck, Building2, Users, Contact } from "lucide-react";
import { useState, useEffect } from "react";

const TypingText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) {
                setTimeout(() => { i = 0; }, 2000); // Pause before loop
            }
        }, 100);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayedText}<span className="animate-pulse">|</span></span>;
};

const FeatureCard = ({ title, description, icon: Icon, size, children, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`
      relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm p-8
      hover:border-white/20 hover:bg-zinc-900/80 transition-all duration-300 group
      ${size === "large" ? "md:col-span-2 md:row-span-2" : ""}
      ${size === "medium" ? "md:col-span-2" : ""}
      ${size === "tall" ? "md:row-span-2" : ""}
      w-full
    `}
    >
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <Icon className="w-24 h-24 text-white/5" />
        </div>

        <div className="relative z-10 h-full flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{description}</p>

            <div className="flex-1 mt-auto">
                {children}
            </div>
        </div>
    </motion.div>
);

const ModuleCard = ({ icon: Icon, title, onClick }: any) => (
    <motion.div
        whileHover={{ scale: 1.05, borderColor: "rgba(139,92,246,0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="min-w-[180px] h-[180px] bg-zinc-900/50 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer backdrop-blur-sm transition-colors hover:bg-zinc-800/80"
    >
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-violet-400 transition-colors">
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-zinc-200 font-medium text-sm">{title}</span>
    </motion.div>
);

export function FeaturesBento() {
    const modules = [
        { title: "Financeiro", icon: DollarSign },
        { title: "Jobs", icon: Briefcase },
        { title: "Itens", icon: Layers },
        { title: "Fornecedores", icon: Truck },
        { title: "Clientes", icon: Building2 },
        { title: "Casting", icon: Users },
        { title: "Contatos", icon: Contact },
        { title: "Relatórios", icon: Layers },
        { title: "Propostas", icon: Briefcase },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-black/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        Tudo o que você precisa
                    </motion.h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">Uma suíte completa de ferramentas para escalar sua operação.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
                    {/* Copilot Section */}
                    <div className="lg:col-span-3">
                        <FeatureCard
                            title="Agency Copilot"
                            description="Sua assistente de IA para lançar notas, buscar jobs e alocar times."
                            icon={Bot}
                            size="large"
                            delay={0.2}
                        >
                            <div className="bg-zinc-950 rounded-lg p-4 border border-white/5 text-xs font-mono h-[300px] flex flex-col relative overflow-hidden group/terminal">
                                {/* Terminal Header */}
                                <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 flex items-center justify-between px-3 border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="flex items-center gap-1.5 opacity-50">
                                        <Mic className="w-3 h-3 text-violet-400 animate-pulse" />
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider">Rec</span>
                                    </div>
                                </div>

                                {/* Terminal Content */}
                                <div className="mt-8 flex flex-col gap-3 font-mono text-sm z-10 relative">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex gap-2 text-zinc-400"
                                    >
                                        <span className="text-violet-500">$</span>
                                        <span>agency-os copilot</span>
                                    </motion.div>

                                    <div className="flex gap-2">
                                        <span className="text-violet-500">{">"}</span>
                                        <motion.span
                                            className="text-zinc-200"
                                            animate={{ opacity: [1, 1, 1] }}
                                        >
                                            <TypingText text="Lançar nota fiscal #1234 de R$ 5.000,00" />
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 1, 0] }}
                                        transition={{
                                            duration: 5,
                                            times: [0, 0.1, 0.9, 1],
                                            repeat: Infinity,
                                            repeatDelay: 1
                                        }}
                                        className="text-green-400 space-y-1"
                                    >
                                        <p>✔ Processando áudio...</p>
                                        <p>✔ Categoria identificada: Produção de Vídeo</p>
                                        <p>✔ Valor: R$ 5.000,00</p>
                                        <p className="text-violet-300">➜ Draft criado em "Financeiro" para aprovação.</p>
                                    </motion.div>
                                </div>
                            </div>
                        </FeatureCard>
                    </div>
                </div>

                {/* Modules Carousel - Infinite Scroll */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-6 w-max animate-loop-scroll hover:pause">
                        {[...modules, ...modules].map((module, i) => (
                            <ModuleCard key={i} {...module} onClick={() => { }} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
