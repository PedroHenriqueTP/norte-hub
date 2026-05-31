"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Placeholder data for portfolio items
const projects = [
    {
        id: 1,
        slug: "aurora-tech",
        client: "Aurora Tech",
        category: "Branding & Identidade",
        size: "large", // spans 2 cols or tall
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200", // Placeholder
    },
    {
        id: 2,
        slug: "vela-co",
        client: "Vela Co.",
        category: "Social Media",
        size: "small",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 3,
        slug: "urban-pulse",
        client: "Urban Pulse",
        category: "Campanha Black Friday",
        size: "medium",
        image: "https://images.unsplash.com/photo-1531297461136-82lw8u221b0?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 4,
        slug: "momentum",
        client: "Momentum",
        category: "Produção de Vídeo",
        size: "small",
        image: "https://images.unsplash.com/photo-1559136555-930b7a4754a4?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 5,
        slug: "elevate",
        client: "Elevate",
        category: "Performance",
        size: "medium",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    },
];

export default function Portfolio() {
    return (
        <section className="bg-white pb-24 text-black">
            <div className="container mx-auto px-4">
                <div className="mb-12 flex items-center justify-between border-b border-black pb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
                        Cases Selecionados
                    </h2>
                    <span className="text-sm font-bold uppercase">2023 — 2025</span>
                </div>

                {/* Masonry-style Grid - using CSS Columns for true Masonry or standard Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`group relative overflow-hidden bg-gray-100 ${project.size === 'large' ? 'md:col-span-2 md:aspect-[2/1]' : 'aspect-square'
                                }`}
                        >
                            <Link href={`/cases/${project.slug}`} className="block h-full w-full">
                                <img
                                    src={project.image}
                                    alt={project.client}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <h3 className="text-2xl font-bold text-white uppercase font-heading">{project.client}</h3>
                                    <p className="text-sm text-gray-200">{project.category}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/cases" className="border-b border-black pb-1 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                        Ver Todos os Cases
                    </Link>
                </div>
            </div>
        </section>
    );
}
