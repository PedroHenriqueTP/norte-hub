import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../constants';
import { Plus } from 'lucide-react';

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/90 p-3 rounded-full text-bakery-900 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-bakery-500 uppercase tracking-wider">{product.category}</span>
                    <span className="font-serif font-bold text-bakery-900 text-lg">{product.price}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-bakery-900 mb-2 group-hover:text-bakery-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-bakery-700 text-sm leading-relaxed">
                    {product.description}
                </p>
            </div>
        </motion.div>
    );
};

const ProductGrid = () => {
    // Extract unique categories for a potential filter bar (future proofing)
    // const categories = [...new Set(THEME.products.map(p => p.category))];

    return (
        <section id="products" className="py-24 bg-bakery-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-bakery-600 font-sans font-bold text-sm tracking-widest uppercase mb-4 block"
                    >
                        Menu Escolhido
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-bakery-900 mb-4"
                    >
                        Sabores Inesquecíveis
                    </motion.h2>
                    <p className="text-bakery-800 text-lg">
                        Dos clássicos fermentados aos doces mais delicados, tudo feito com paixão.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {THEME.products.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="px-8 py-3 bg-bakery-900 text-white font-bold rounded-lg shadow-lg hover:bg-bakery-800 hover:shadow-xl transition-all hover:-translate-y-1">
                        Ver Menu Completo
                    </button>
                </div>

            </div>
        </section>
    );
};

export default ProductGrid;
