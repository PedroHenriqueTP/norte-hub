import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

export default function ProductCard({ product }) {
    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                {/* Badges */}
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-brand-black text-white text-xs font-bold px-2 py-1 uppercase tracking-wider z-10">
                        New
                    </span>
                )}
                {product.discount && (
                    <span className="absolute top-3 right-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {product.discount}
                    </span>
                )}

                {/* Quick Actions (Hover) */}
                <div className="absolute right-3 bottom-3 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <button className="bg-white p-2.5 rounded-full shadow-lg hover:bg-brand-red hover:text-white transition-colors" title="Add to Wishlist">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="bg-white p-2.5 rounded-full shadow-lg hover:bg-brand-black hover:text-white transition-colors" title="Add to Cart">
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">{product.category}</p>
                <h3 className="text-brand-black font-bold text-lg mb-1 group-hover:text-brand-red transition-colors truncate">{product.name}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-brand-black font-bold text-lg">R$ {product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                        <span className="text-gray-400 text-sm line-through">R$ {product.oldPrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
