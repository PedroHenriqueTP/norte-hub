'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxImage from './ui/ParallaxImage';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    { id: 1, title: 'NEON FUTURE', category: 'Brand Identity', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'DIGITAL DREAMS', category: 'Web Development', img: 'https://images.unsplash.com/photo-1558655146-d09347e0b7a8?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'VELOCITY LABS', category: 'Product Design', img: 'https://images.unsplash.com/photo-1626284699500-11116f1c4df2?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, title: 'RHYTHM SOUL', category: 'Campaign', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop' },
];

export default function Work() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const trigger = triggerRef.current;

        if (!section || !trigger) return;

        // Horizontal Scroll Animation
        const pin = gsap.fromTo(
            section,
            {
                translateX: 0,
            },
            {
                translateX: '-300vw', // Move by 3 viewport widths (projects.length - 1)
                ease: 'none',
                duration: 1,
                scrollTrigger: {
                    trigger: trigger,
                    start: 'top top',
                    end: '+=3000', // Scroll distance to complete the animation
                    scrub: 1,
                    pin: true,
                    // markers: true, // Enable for debugging
                },
            }
        );

        return () => {
            pin.kill();
        };
    }, []);

    return (
        <section ref={triggerRef} className="relative h-screen bg-black text-white overflow-hidden">
            <div className="absolute top-10 left-10 z-10 mix-blend-difference">
                <h2 className="text-4xl font-bold tracking-tighter">SELECTED WORKS (2024-2025)</h2>
            </div>

            <div ref={sectionRef} className="flex h-full w-[400vw]">
                {projects.map((project) => (
                    <div key={project.id} className="w-screen h-full flex flex-col items-center justify-center relative border-r border-white/10">
                        <div className="w-[60vw] h-[60vh] relative group cursor-pointer">
                            {/* Image Container with Parallax and Hover Distortion */}
                            <div className="absolute inset-0 overflow-hidden rounded-sm transition-transform duration-700 ease-out group-hover:scale-95">
                                <ParallaxImage src={project.img} alt={project.title} className="w-full h-full" speed={0.2} />
                                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-500 mix-blend-overlay" />
                            </div>

                            {/* Text Reveal */}
                            <div className="absolute -bottom-20 left-0 w-full">
                                <h3 className="text-6xl font-black uppercase tracking-tighter translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    {project.title}
                                </h3>
                                <p className="text-lg text-gray-400 font-mono mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {project.category}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
