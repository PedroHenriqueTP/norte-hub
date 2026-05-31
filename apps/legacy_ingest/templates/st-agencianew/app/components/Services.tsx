"use client";

import { motion } from "framer-motion";

const services = [
    "Branding & Identidade",
    "Performance & Tráfego Pago",
    "Social Media & Conteúdo",
    "Produção de Vídeo (Filmes)",
];

export default function Services() {
    return (
        <section className="bg-white py-24 text-black md:py-32">
            <div className="container mx-auto px-4">
                <div className="mb-16 border-b border-black pb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                        Nossos Serviços
                    </h2>
                </div>

                <div className="flex flex-col">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group border-b border-gray-200 py-8 transition-colors hover:bg-gray-50"
                        >
                            <h3 className="cursor-pointer text-3xl font-bold uppercase tracking-tight md:text-5xl lg:text-6xl font-heading transition-transform duration-300 group-hover:translate-x-4">
                                {service}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
