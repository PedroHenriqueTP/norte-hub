"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
    return (
        <section id="contact" className="py-24 bg-zinc-950 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-8">Vamos conversar?</h2>
                        <p className="text-zinc-400 text-lg mb-12">
                            Quer ver como o AgencyOS pode transformar sua agência?
                            Fale com nosso time comercial ou agende uma demo.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-zinc-300">
                                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span>contato@agencyos.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-300">
                                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span>+55 (11) 99999-9999</span>
                            </div>
                            <div className="flex items-center gap-4 text-zinc-300">
                                <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span>São Paulo, SP - Brasil</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl p-8"
                    >
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Nome</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:border-violet-500 outline-none transition-colors" placeholder="Seu nome" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Sobrenome</label>
                                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:border-violet-500 outline-none transition-colors" placeholder="Sobrenome" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Email Corporativo</label>
                                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:border-violet-500 outline-none transition-colors" placeholder="voce@empresa.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Mensagem</label>
                                <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-white focus:border-violet-500 outline-none transition-colors" placeholder="Como podemos ajudar?" />
                            </div>

                            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-6">
                                Enviar Mensagem
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
