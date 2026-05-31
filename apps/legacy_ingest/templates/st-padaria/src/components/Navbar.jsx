import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { THEME } from '../constants';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled
                        ? 'bg-bakery-950/90 backdrop-blur-md shadow-lg py-3'
                        : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                    {/* Logo */}
                    <a href="#" className="font-serif font-bold text-2xl md:text-3xl text-bakery-50 tracking-tighter hover:opacity-80 transition-opacity">
                        Padaria<span className="text-bakery-500">.</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {THEME.links.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-bakery-100 hover:text-bakery-500 font-sans font-medium text-sm tracking-wide uppercase transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center">
                        <button className="flex items-center gap-2 px-6 py-2 bg-bakery-500 hover:bg-bakery-400 text-white rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            <ShoppingBag size={18} />
                            Peça Online
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-bakery-50 hover:text-bakery-500 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-bakery-950 pt-24 px-6 md:hidden flex flex-col items-center"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-xs mx-auto">
                            {THEME.links.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-serif text-bakery-100 hover:text-bakery-500"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="w-12 h-px bg-bakery-800 my-2" />
                            <button className="w-full py-4 bg-bakery-500 text-white rounded-lg font-bold text-lg">
                                Peça Online
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
