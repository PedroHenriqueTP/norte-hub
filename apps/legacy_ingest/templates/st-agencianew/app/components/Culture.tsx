"use client";

import { motion } from "framer-motion";

export default function Culture() {
    return (
        <section className="bg-black py-24 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
                    {/* Text Content */}
                    <div className="lg:col-span-4 lg:pr-12">
                        <h2 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-500">
                            A Agência
                        </h2>
                        <h3 className="mb-6 text-4xl font-bold font-heading uppercase leading-none md:text-5xl">
                            Somos <br /> Makers
                        </h3>
                        <p className="mb-6 text-lg text-gray-400">
                            Não somos apenas estrategistas de slides. Somos criadores obcecados por execução. Nossa cultura é "Mão na Massa": menos reuniões, mais deploy.
                        </p>
                        <p className="text-lg text-gray-400">
                            Acreditamos que o design não é apenas visual, é como funciona. E performance não é sorte, é matemática aplicada à criatividade.
                        </p>
                    </div>

                    {/* Image Grid */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative h-64 w-full overflow-hidden bg-gray-800 md:h-80"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    alt="Team working"
                                    className="h-full w-full object-cover grayscale transition-transform hover:scale-105"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative mt-12 h-64 w-full overflow-hidden bg-gray-800 md:h-80"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
                                    alt="Office vibe"
                                    className="h-full w-full object-cover grayscale transition-transform hover:scale-105"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
