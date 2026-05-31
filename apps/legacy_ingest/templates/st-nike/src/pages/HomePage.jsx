import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

const products = [
    { id: 1, name: 'Aether Pro Run', category: 'Men\'s Running', price: 899.90, image: '/images/product-shoe.png', isNew: true },
    { id: 2, name: 'Aether Pro Run W', category: 'Women\'s Running', price: 899.90, image: '/images/product-shoe.png' },
    { id: 3, name: 'Velocity X', category: 'Training', price: 649.90, image: '/images/product-shoe.png', discount: '-20%' },
    { id: 4, name: 'Velocity X Lite', category: 'Training', price: 649.90, image: '/images/product-shoe.png' },
];

export default function HomePage() {
    return (
        <div className="animate-fade-in pb-20">
            <HeroCarousel />

            {/* Trending Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase relative z-10">Trending Now</h2>
                    <a href="#" className="hidden md:flex items-center text-lg font-bold uppercase hover:text-brand-red transition-colors group">
                        Shop All <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="bg-brand-black text-white px-10 py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition-colors">
                        Shop All
                    </button>
                </div>
            </section>

            {/* Featured Banner */}
            <section className="relative h-[85vh] bg-brand-black overflow-hidden group">
                <div className="absolute inset-0">
                    <img
                        src="/images/promo-gym.png"
                        alt="Feature"
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[2000ms]"
                    />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-transparent z-10" />

                <div className="relative h-full z-20 flex flex-col items-start justify-center px-6 md:px-20 max-w-7xl mx-auto">
                    <h2 className="text-brand-red font-bold tracking-[0.2em] uppercase mb-6 text-xl animate-fade-in-up">Just Dropped</h2>
                    <h3 className="text-5xl md:text-8xl lg:text-9xl font-black italic text-white mb-8 tracking-tighter leading-[0.9] animate-fade-in-up delay-100">
                        FORWARD <br /> MOTION
                    </h3>
                    <p className="text-gray-300 text-lg md:text-2xl max-w-md mb-12 leading-relaxed animate-fade-in-up delay-200">
                        Engineered for the modern athlete. The collection that changes everything.
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-300">
                        <button className="bg-white text-brand-black px-10 py-4 rounded-full font-bold uppercase hover:bg-brand-gray hover:scale-105 transition-all">
                            Shop Collection
                        </button>
                        <button className="border border-white text-white px-10 py-4 rounded-full font-bold uppercase hover:bg-white hover:text-brand-black hover:scale-105 transition-all">
                            Read Story
                        </button>
                    </div>
                </div>
            </section>

            {/* Category Split */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16">
                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-6 md:mb-0">The Essentials</h2>
                    <div className="flex space-x-4">
                        <button className="px-8 py-3 rounded-full border border-gray-200 hover:border-brand-black font-bold transition-all text-brand-black bg-white hover:shadow-lg">Men</button>
                        <button className="px-8 py-3 rounded-full border border-gray-200 hover:border-brand-black font-bold transition-all text-gray-500 hover:text-brand-black hover:bg-white hover:shadow-lg">Women</button>
                        <button className="px-8 py-3 rounded-full border border-gray-200 hover:border-brand-black font-bold transition-all text-gray-500 hover:text-brand-black hover:bg-white hover:shadow-lg">Kids</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative h-[600px] rounded-2xl overflow-hidden group cursor-pointer">
                        <img src="/images/hero-main.png" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Running" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="text-4xl font-black italic text-white mb-4 tracking-tighter">RUNNING</h3>
                            <button className="bg-white text-brand-black px-8 py-3 rounded-full font-bold uppercase hover:bg-brand-gray transition-colors">Shop Now</button>
                        </div>
                    </div>
                    <div className="relative h-[600px] rounded-2xl overflow-hidden group cursor-pointer border border-gray-100">
                        <img src="/images/product-shoe.png" className="w-full h-full object-contain p-20 bg-brand-gray transition-transform duration-700 group-hover:scale-105" alt="Lifestyle" />
                        <div className="absolute bottom-10 left-10">
                            <h3 className="text-4xl font-black italic text-brand-black mb-4 tracking-tighter">LIFESTYLE</h3>
                            <button className="bg-brand-black text-white px-8 py-3 rounded-full font-bold uppercase hover:bg-gray-800 transition-colors">Shop Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
