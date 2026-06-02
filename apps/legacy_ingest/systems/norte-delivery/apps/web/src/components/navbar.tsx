"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export function Navbar() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    // If dashboard, use standard sticky white navbar
    if (isDashboard) {
        return (
            <nav className="navbar">
                <div className="container-fluid navbar-content">
                    <Link href="/dashboard" className="text-xl font-bold tracking-tight text-primary">
                        DeliveryPlatform
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                    </div>
                </div>
            </nav>
        );
    }

    const [clickCount, setClickCount] = useState(0);
    const [partyMode, setPartyMode] = useState(false);

    const handleLogoClick = (e: React.MouseEvent) => {
        if (clickCount + 1 >= 5) {
            setPartyMode(!partyMode);
            setClickCount(0);
            // Trigger confetti or visual change here typically
            // For now we toggle a class or state that affects colors
        } else {
            setClickCount(prev => prev + 1);
        }
    };

    const navbarClasses = scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-white/20'
        : 'bg-transparent py-6';

    const partyClasses = partyMode ? 'bg-black/90 text-neon-green border-neon-green' : '';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarClasses} ${partyClasses}`}
        >
            <div className="container-fluid flex items-center justify-between">
                <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 group cursor-pointer select-none">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-transform ${partyMode ? 'bg-green-500 text-black rotate-180' : 'bg-primary text-white group-hover:scale-110'}`}>D</div>
                    <span className={`text-2xl font-bold tracking-tight transition-colors ${partyMode ? 'text-green-400' : 'text-main'}`}>
                        DeliveryPlatform {partyMode && '🦄'}
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {[
                        { name: 'O App', id: 'o-app' },
                        { name: 'Funcionalidades', id: 'funcionalidades' },
                        { name: 'Sobre nós', id: 'sobre-nos' },
                        { name: 'Objetivo', id: 'objetivo' },
                        { name: 'Legado', id: 'legado' },
                        { name: 'Recomendações', id: 'recomendacoes' }
                    ].map((item) => (
                        <Link
                            key={item.id}
                            href={`#${item.id}`}
                            className={`text-base font-bold transition-colors tracking-wide ${partyMode ? 'text-green-200 hover:text-green-500' : (scrolled ? 'text-text-muted hover:text-primary' : 'text-text-main hover:text-primary')}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth/signin" className={`text-base font-bold transition-colors ${partyMode ? 'text-green-400' : 'text-text-main hover:text-primary'}`}>
                        Login
                    </Link>
                    <Link
                        href="/auth/signup"
                        className={`px-7 py-3 rounded-full text-base font-bold transition-all hover:scale-105 shadow-lg ${partyMode ? 'bg-green-500 text-black shadow-green-500/50' : 'bg-main text-white hover:bg-gray-800 shadow-orange-500/20'}`}
                    >
                        Começar Agora
                    </Link>
                </div>
            </div>
        </nav>
    );
}
