'use client';

import { motion } from 'framer-motion';

const services = [
    "STRATEGY",
    "BRANDING",
    "WEB DESIGN",
    "DEVELOPMENT",
    "CONTENT",
];

export default function Services() {
    return (
        <section className="bg-white text-black py-32 rounded-t-3xl relative z-10">
            <div className="container mx-auto px-4">
                <h2 className="text-xl mb-12 border-b border-black/20 pb-4">OUR EXPERTISE</h2>

                <div className="flex flex-col">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial="initial"
                            whileHover="hover"
                            className="border-b border-black/10 py-8 cursor-pointer group flex items-baseline overflow-hidden"
                        >
                            <motion.span
                                className="text-[8vw] leading-[0.85] font-black tracking-tighter block"
                                variants={{
                                    initial: { x: 0, fontStyle: 'normal' },
                                    hover: { x: 20, fontStyle: 'italic', color: '#ccff00', WebkitTextStroke: '2px black' }
                                } as any}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {service}
                            </motion.span>
                            <motion.span
                                className="ml-4 text-xl font-mono hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                (0{index + 1})
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
