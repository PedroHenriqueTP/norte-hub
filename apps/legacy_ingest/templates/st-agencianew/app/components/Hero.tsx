"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-50"
                    // Using a placeholder heavy-industrial/abstract video if available, or just a dark placeholder
                    // For now, using a colored div fallback if video fails or as placeholder
                    poster="/video-poster.jpg"
                >
                    {/* <source src="/hero-video.mp4" type="video/mp4" /> */}
                </video>
                <div className="absolute inset-0 bg-black/60" /> {/* Overlay for text contrast */}

                {/* Navigation */}
                <header className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
                    <div className="hidden md:flex gap-6">
                        <a href="/cases" className="text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors">Cases</a>
                        <a href="/blog" className="text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors">Insights</a>
                        <a href="/briefing" className="text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors">Contato</a>
                    </div>
                </header>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-6"
                >
                    {/* Logo Placeholder - Simple Text based on prompt */}
                    <h2 className="text-xl font-bold tracking-widest uppercase mb-4">Antigravity</h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-4xl text-5xl font-bold uppercase leading-tight tracking-tighter md:text-7xl lg:text-8xl font-heading"
                >
                    Estratégia, Design <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">e Performance</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="absolute bottom-12 text-sm uppercase tracking-widest animate-pulse"
                >
                    Scroll to Explore
                </motion.p>
            </div>
        </section>
    );
}
