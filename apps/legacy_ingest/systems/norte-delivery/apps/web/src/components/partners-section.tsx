"use client";

import { motion } from "framer-motion";
import { Utensils, Coffee, Pizza, Beer, Croissant, Send, CreditCard, MessageCircle } from "lucide-react";
import { SiIfood, SiUber, SiWhatsapp, SiStripe, SiVisa, SiMastercard, SiTelegram } from "react-icons/si";

const PARTNERS = [
    // Group A: Tech & Delivery (Real Brands)
    { name: "iFood", icon: SiIfood, color: "text-[#EA1D2C]" },
    { name: "Uber Eats", icon: SiUber, color: "text-[#06C167]" },
    { name: "Rappi", icon: null, color: "text-[#FF441F]", label: "Rappi" }, // Lucide doesn't have Rappi, using text fallback or can use simple icon if installed
    { name: "WhatsApp", icon: SiWhatsapp, color: "text-[#25D366]" },
    { name: "Stripe", icon: SiStripe, color: "text-[#008CDD]" },
    { name: "Visa", icon: SiVisa, color: "text-[#1434CB]" },
    { name: "Mastercard", icon: SiMastercard, color: "text-[#EB001B]" },

    // Group B: Industry (Generic Symbols)
    { name: "Restaurantes", icon: Utensils, color: "text-orange-500" },
    { name: "Cafeterias", icon: Coffee, color: "text-brown-500" },
    { name: "Pizzarias", icon: Pizza, color: "text-red-500" },
    { name: "Bares", icon: Beer, color: "text-yellow-600" },
    { name: "Padarias", icon: Croissant, color: "text-yellow-600" },
];

export const PartnersSection = () => {
    return (
        <section className="py-16 bg-main overflow-hidden border-y border-white/5">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-3">
                    ECOSSISTEMA COMPLETO
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Conectado às ferramentas que você já ama.
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    De pagamentos a entregadores, nossa API conversa com os líderes do mercado.
                </p>
            </div>

            <div className="flex overflow-hidden relative w-full group py-4">
                {/* Gradient Masks */}
                <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-main to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-main to-transparent z-10 pointer-events-none"></div>

                {/* Infinite Loop Container */}
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-16 whitespace-nowrap px-8 items-center"
                >
                    {/* Render List Twice for Seamless Loop */}
                    {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                        <div
                            key={i}
                            className="group/item flex items-center gap-3 opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-default"
                        >
                            <div className={`text-3xl md:text-4xl ${partner.color} transition-transform group-hover/item:scale-110`}>
                                {partner.icon ? <partner.icon /> : <span className="font-bold text-xl">{partner.label}</span>}
                            </div>
                            <span className="font-bold text-xl text-white hidden md:block">
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
