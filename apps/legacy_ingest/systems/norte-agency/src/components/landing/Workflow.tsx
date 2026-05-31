"use client";

import { motion } from "framer-motion";
import { Check, ClipboardList, FileText, Send, DollarSign } from "lucide-react";

const steps = [
    { id: 1, title: "Briefing", icon: ClipboardList },
    { id: 2, title: "Budget", icon: DollarSign },
    { id: 3, title: "Approval", icon: Check },
    { id: 4, title: "Job", icon: Send },
    { id: 5, title: "Invoice", icon: FileText },
];

export function Workflow() {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden border-y border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        Fluxo Inteligente
                    </motion.h2>
                    <p className="text-zinc-400">Do briefing à nota fiscal em uma única plataforma.</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 hidden md:block">
                        <motion.div
                            className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                className="flex flex-col items-center gap-6 group relative"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-violet-500 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                    <step.icon className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />

                                    {/* Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-400 transition-colors">
                                        {step.id}
                                    </div>
                                </div>

                                <span className="text-zinc-400 font-medium group-hover:text-white transition-colors">
                                    {step.title}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
