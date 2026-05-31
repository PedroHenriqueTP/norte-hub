import React from 'react';
import { THEME } from '../constants';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-bakery-950 text-bakery-300 py-12 border-t border-bakery-900">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">

                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-serif font-bold text-bakery-50 mb-2">Padaria.</h3>
                    <p className="text-sm opacity-60">© 2024 Padaria Premium. Todos os direitos reservados.</p>
                </div>

                <div className="flex gap-6">
                    <a href="#" className="hover:text-bakery-500 transition-colors"><Instagram size={24} /></a>
                    <a href="#" className="hover:text-bakery-500 transition-colors"><Facebook size={24} /></a>
                    <a href="#" className="hover:text-bakery-500 transition-colors"><Twitter size={24} /></a>
                </div>

                <div className="flex gap-6 text-sm font-sans font-medium">
                    <a href="#" className="hover:text-bakery-50">Privacidade</a>
                    <a href="#" className="hover:text-bakery-50">Termos</a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
