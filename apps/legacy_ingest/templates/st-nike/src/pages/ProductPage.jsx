import React, { useState } from 'react';
import { Star, Heart, Share2, Shield, Truck, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const relatedProducts = [
    { id: 2, name: 'Aether Pro Run W', category: 'Women\'s Running', price: 899.90, image: '/images/product-shoe.png', isNew: true },
    { id: 3, name: 'Velocity X', category: 'Training', price: 649.90, image: '/images/product-shoe.png', discount: '-20%' },
    { id: 4, name: 'Velocity X Lite', category: 'Training', price: 649.90, image: '/images/product-shoe.png' },
    { id: 1, name: 'Aether Pro Run', category: 'Men\'s Running', price: 899.90, image: '/images/product-shoe.png' },
];

export default function ProductPage() {
    const [selectedSize, setSelectedSize] = useState(null);

    return (
        <div className="pt-24 pb-16 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                    {/* Gallery Section */}
                    <div className="lg:w-3/5 space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                            <img src="/images/product-shoe.png" alt="Product Main" className="w-full h-full object-contain p-12 transition-transform duration-500 group-hover:scale-110" />
                            <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-black transition-all">
                                    <img src="/images/product-shoe.png" alt={`Thumbnail ${i}`} className="w-full h-full object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-2/5 pt-4">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-brand-red font-bold uppercase tracking-wider text-sm">Best Seller</span>
                            <div className="flex items-center text-yellow-500 text-sm font-bold">
                                <Star className="w-4 h-4 fill-current mr-1" /> 4.9 (128 Reviews)
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-brand-black mb-2">
                            AETHER PRO <br /> RUNNER
                        </h1>
                        <p className="text-gray-500 font-medium text-lg mb-6">Men's Road Racing Shoes</p>

                        <div className="flex items-end space-x-4 mb-8">
                            <span className="text-3xl font-bold text-brand-black">R$ 899,90</span>
                            <span className="text-xl text-gray-400 line-through mb-1">R$ 1.199,90</span>
                            <span className="text-brand-green font-bold text-sm bg-green-50 px-2 py-1 rounded mb-1">Save 25%</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-brand-black mb-4">Select Size</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {['38', '39', '40', '41', '42', '43', '44', '45'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-lg border font-bold transition-all ${selectedSize === size
                                                ? 'border-brand-black bg-brand-black text-white'
                                                : 'border-gray-200 hover:border-brand-black text-brand-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex space-x-4 mb-8">
                            <button className="flex-1 bg-brand-black text-white py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition-colors shadow-lg shadow-brand-a/20">
                                Add to Cart
                            </button>
                            <button className="p-4 border border-gray-300 rounded-full hover:border-brand-red hover:text-brand-red transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            Experience the future of speed. The Aether Pro Runner features our lightest FlyKnit upper and responsive ZoomX foam for maximum energy return. Designed for athletes who demand the best.
                        </p>

                        <div className="border-t border-gray-100 pt-6 space-y-4">
                            <div className="flex items-center text-sm font-medium text-gray-700">
                                <Shield className="w-5 h-5 mr-3 text-gray-400" /> 2 Year Warranty
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-700">
                                <Truck className="w-5 h-5 mr-3 text-gray-400" /> Free Delivery over R$ 200
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-700">
                                <RotateCcw className="w-5 h-5 mr-3 text-gray-400" /> Free Returns within 30 days
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-32">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
