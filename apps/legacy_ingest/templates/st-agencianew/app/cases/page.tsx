"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const projects = [
    {
        id: 1,
        slug: "aurora-tech",
        client: "Aurora Tech",
        category: "Branding & Identidade",
        size: "large",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1200",
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
    {
        id: 6,
        slug: "glitch-studio",
        client: "Glitch Studio",
        category: "Web Design",
        size: "small",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
    }
];

export default function Cases() {
    return (
        <div className="min-h-screen bg-white text-black p-4 md:p-12 pt-32">
            <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between bg-white/90 backdrop-blur-md">
                <Link href="/" className="text-xl font-bold font-heading">ANTIGRAVITY</Link>
                <nav className="hidden md:block">
                    <ul className="flex gap-6 uppercase text-sm font-bold tracking-widest">
                        <li><Link href="/blog">Insights</Link></li>
                        <li><Link href="/briefing">Contato</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="container mx-auto">
                <h1 className="text-6xl md:text-9xl font-bold font-heading uppercase mb-24 tracking-tighter">Cases</h1>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`group relative overflow-hidden bg-gray-100 ${project.size === 'large' ? 'md:col-span-2 md:aspect-[2/1]' : 'aspect-square'}`}
                        >
                            <Link href={`/cases/${project.slug}`} className="block h-full w-full">
                                <img
                                    src={project.image}
                                    alt={project.client}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:grayscale"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <h3 className="text-2xl font-bold text-white uppercase font-heading">{project.client}</h3>
                                    <p className="text-sm text-gray-200">{project.category}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
