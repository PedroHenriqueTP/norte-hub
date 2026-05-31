import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';

const About = () => {
    return (
        <section id="about" className="py-24 bg-bakery-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 md:order-1">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-bakery-600 font-sans font-bold text-sm tracking-widest uppercase mb-4 block"
                        >
                            Nossa História
                        </motion.span>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-bakery-900 mb-8"
                        >
                            Tradição que você sente em cada mordida.
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6 text-bakery-800 font-sans leading-relaxed text-lg"
                        >
                            <p>
                                Nascemos do desejo de resgatar a panificação artesanal. Em um mundo de pressa, nós escolhemos o tempo. O tempo da fermentação natural, o tempo de selecionar os melhores grãos de café, o tempo de criar experiências.
                            </p>
                            <p>
                                Nossa padaria não é apenas um lugar para comprar pão. É um refúgio para os sentidos, onde o aroma de café fresco se mistura com o calor do forno a lenha.
                            </p>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-10 px-8 py-3 border-2 border-bakery-900 text-bakery-900 hover:bg-bakery-900 hover:text-bakery-50 transition-colors duration-300 font-bold rounded-lg"
                        >
                            Conheça Nossa Cozinha
                        </motion.button>
                    </div>

                    {/* Image Grid with Parallax Vibe */}
                    <div className="order-1 md:order-2 relative h-[600px] w-full">
                        {/* Background Decoration */}
                        <div className="absolute top-10 right-10 w-64 h-64 bg-bakery-200 rounded-full blur-3xl opacity-50" />

                        {/* Image 1 - Main */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="absolute top-0 right-0 w-3/4 h-[400px] rounded-2xl overflow-hidden shadow-2xl z-10"
                        >
                            <img
                                src={THEME.images.about1}
                                alt="Baker Hands"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>

                        {/* Image 2 - Offset */}
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute bottom-0 left-0 w-2/3 h-[300px] rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-bakery-50"
                        >
                            <img
                                src={THEME.images.about2}
                                alt="Interior"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
