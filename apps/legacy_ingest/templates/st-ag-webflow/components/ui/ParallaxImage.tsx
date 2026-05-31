'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    speed?: number; // Parallax speed (e.g., 0.5 for half speed)
}

export default function ParallaxImage({ src, alt, className = '', speed = 0.5 }: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const img = imageRef.current;

        if (!container || !img) return;

        // Reset setup
        gsap.set(img, { scale: 1.2 }); // Start zoomed in so we have room to move

        // Create animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top bottom', // Start when container enters viewport
                end: 'bottom top',   // End when container leaves viewport
                scrub: true,         // Link animation to scroll position
            },
        });

        tl.to(img, {
            yPercent: 20 * speed, // Move image vertically
            ease: 'none',
        });

        return () => {
            tl.kill();
        };
    }, [speed]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
            {/* Fill the container */}
            <Image
                ref={imageRef as any} // Cast because next/image ref typing can be tricky with GSAP
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );
}
