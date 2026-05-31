"use client";

import { motion } from "framer-motion";

export function About() {
    return (
        <section id="about" className="py-24 bg-black relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <h2 className="text-sm font-bold tracking-widest text-violet-500 uppercase mb-4">Sobre Nós</h2>
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-12 tracking-tight">
                        Construindo o sistema operacional <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                            para a nova economia criativa.
                        </span>
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h4 className="text-2xl font-bold text-white mb-6">Quem Somos</h4>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                            Somos um time de engenheiros, designers e ex-donos de agência obcecados por eficiência.
                            Entendemos a dor de planilhas desconexas, briefs perdidos e margens de lucro invisíveis.
                        </p>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            O AgencyOS nasceu para eliminar o caos operacional, permitindo que criativos foquem no que importa:
                            criar trabalhos incríveis.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-2xl opacity-20 blur-xl" />
                        <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8">
                            <h4 className="text-2xl font-bold text-white mb-6">Nosso Propósito</h4>
                            <ul className="space-y-4">
                                {[
                                    "Centralizar toda a operação em um único lugar.",
                                    "Dar visibilidade financeira em tempo real.",
                                    "Automatizar tarefas repetitivas com IA.",
                                    "Conectar talentos globais a projetos locais."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2.5" />
                                        <span className="text-zinc-300 text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
