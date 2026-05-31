import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const SocialProof = () => {
    return (
        <section className="py-20 bg-bakery-900 text-bakery-50 relative overflow-hidden">
            {/* Decorative noise/texture overlay could go here */}

            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                        "O melhor lugar para começar o dia."
                    </h2>
                    <div className="flex justify-center gap-1 text-bakery-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill="currentColor" />
                        ))}
                    </div>
                    <p className="font-sans text-bakery-200">
                        — Avaliação média de 4.9 estrelas em mais de 500 reviews.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { number: "5k+", label: "Cafés Servidos/Mês" },
                        { number: "48h", label: "Fermentação Natural" },
                        { number: "100%", label: "Orgânico & Artesanal" }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ scale: 0.5, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            className="p-6 border border-bakery-800 rounded-2xl bg-bakery-950/50 backdrop-blur-sm"
                        >
                            <div className="text-4xl font-serif font-bold text-bakery-500 mb-2">{stat.number}</div>
                            <div className="text-bakery-300 font-sans uppercase tracking-widest text-xs">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
