import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer">
                        <a href="/" className="text-3xl font-bold italic tracking-tighter text-brand-black">
                            ATHLETE<span className="text-brand-red">PRO</span>
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-8">
                        {['Men', 'Women', 'Kids', 'Gear', 'Sale'].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-brand-black hover:text-brand-red font-medium uppercase tracking-wide transition-colors relative group"
                            >
                                {item}
                                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative group hidden lg:block">
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 rounded-full bg-brand-gray text-sm focus:outline-none focus:ring-1 focus:ring-brand-black transition-all w-32 focus:w-64"
                            />
                            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-2.5" />
                        </div>
                        <button className="text-brand-black hover:text-brand-red transition-colors"><User className="w-6 h-6" /></button>
                        <button className="text-brand-black hover:text-brand-red transition-colors relative">
                            <ShoppingBag className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button className="text-brand-black hover:text-brand-red"><ShoppingBag className="w-6 h-6" /></button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-black hover:text-brand-red transition-colors">
                            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-brand-white border-t border-gray-100 absolute w-full shadow-lg animate-fade-in-down">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-brand-gray text-base focus:outline-none focus:ring-1 focus:ring-brand-black"
                            />
                            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
                        </div>
                        {['Men', 'Women', 'Kids', 'Gear', 'Sale'].map((item) => (
                            <a key={item} href="#" className="block px-3 py-3 text-lg font-medium text-brand-black hover:bg-brand-gray hover:text-brand-red rounded-md">
                                {item}
                            </a>
                        ))}
                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <a href="#" className="flex items-center px-3 py-3 text-lg font-medium text-brand-black hover:text-brand-red">
                                <User className="w-5 h-5 mr-3" /> Account
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
