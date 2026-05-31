import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold italic tracking-tighter">
                            ATHLETE<span className="text-brand-red">PRO</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Empowering athletes everywhere to reach their full potential.
                            Designed for performance, engineered for victory.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-brand-black transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-brand-black transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-brand-black transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-brand-black transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-brand-gray">Shop</h4>
                        <ul className="space-y-3 text-gray-400 text-sm font-medium">
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">New Releases</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Men</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Women</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Kids</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Sale</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-brand-gray">Support</h4>
                        <ul className="space-y-3 text-gray-400 text-sm font-medium">
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Order Status</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Shipping & Delivery</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Returns</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Payment Options</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-wider text-brand-gray">Stay in the Loop</h4>
                        <p className="text-gray-400 text-sm mb-4">Sign up for exclusive offers and updates.</p>
                        <form className="flex flex-col space-y-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-brand-white focus:ring-1 focus:ring-brand-white transition-all"
                                />
                            </div>
                            <button className="w-full bg-white text-brand-black font-bold uppercase py-3 rounded-lg hover:bg-brand-gray transform hover:scale-[1.02] transition-all">
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; 2026 AthletePro. All rights reserved. Brazil.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Use</a>
                        <a href="#" className="hover:text-white">CA Supply Chains Act</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
