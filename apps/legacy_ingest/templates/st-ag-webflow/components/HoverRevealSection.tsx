'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const items = [
    {
        id: 1,
        title: 'STRATEGY',
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', // Meeting/Strategy
    },
    {
        id: 2,
        title: 'DESIGN',
        img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop', // Art/Design
    },
    {
        id: 3,
        title: 'DEVELOPMENT',
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop', // Code
    },
    {
        id: 4,
        title: 'MARKETING',
        img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2076&auto=format&fit=crop', // Analytics/Marketing
    },
];

export default function HoverRevealSection() {
    const [activeId, setActiveId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="relative w-full py-32 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="relative group cursor-pointer py-4"
                        onMouseEnter={() => setActiveId(item.id)}
                        onMouseLeave={() => setActiveId(null)}
                    >
                        {/* Text */}
                        <h2 className={`text-6xl md:text-8xl font-black uppercase tracking-tighter transition-colors duration-300 ${activeId && activeId !== item.id ? 'text-gray-800' : 'text-white'}`}>
                            {item.title}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Floating Image Display */}
            <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] z-0 mix-blend-difference">
                <AnimatePresence mode="wait">
                    {activeId && (
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
                            className="absolute inset-0 rounded-lg overflow-hidden"
                        >
                            <Image
                                src={items.find((i) => i.id === activeId)?.img || ''}
                                alt="Selected Work"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-10 text-center text-white/30 text-sm">
                HOVER TO EXPLORE OUR EXPERTISE
            </div>
        </section>
    );
}
