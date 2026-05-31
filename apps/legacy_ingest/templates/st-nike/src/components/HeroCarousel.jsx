import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: '/images/hero-main.png',
        title: "UNLEASH YOUR POTENTIAL",
        subtitle: "Dominate the track with our latest Pro Series.",
        cta: "Shop Running",
        position: "center"
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: "TRAIN WITHOUT LIMITS",
        subtitle: "High-performance gear for every workout.",
        cta: "Shop Training",
        position: "center"
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-brand-black">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                    />

                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="overflow-hidden">
                            <h2 className={`text-xl md:text-2xl font-bold tracking-[0.2em] mb-4 text-brand-gray uppercase transform transition-transform duration-700 ${index === current ? 'translate-y-0' : 'translate-y-full'}`}>
                                {slide.subtitle}
                            </h2>
                        </div>
                        <div className="overflow-hidden mb-8">
                            <h1 className={`text-5xl md:text-7xl lg:text-9xl font-black italic tracking-tighter text-white drop-shadow-2xl transform transition-transform duration-700 delay-100 ${index === current ? 'translate-y-0' : 'translate-y-full'}`}>
                                {slide.title}
                            </h1>
                        </div>

                        <button className={`bg-brand-white text-brand-black px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-brand-gray hover:scale-105 transition-all duration-500 delay-300 transform ${index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {slide.cta}
                        </button>
                    </div>
                </div>
            ))}

            <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all group">
                <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all group">
                <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-12 bg-brand-white' : 'w-6 bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>
    );
}
