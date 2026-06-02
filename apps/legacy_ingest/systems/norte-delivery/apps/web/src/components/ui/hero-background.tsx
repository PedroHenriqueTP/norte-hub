
"use client";
import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HeroBackground = React.forwardRef<HTMLDivElement, {
    className?: string;
    children: React.ReactNode;
}>(({
    className,
    children,
}, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (ref.current) {
                const { left, top } = ref.current.getBoundingClientRect();
                x.set(e.clientX - left);
                y.set(e.clientY - top);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            ref={ref}
            className={cn(
                "relative w-full h-full overflow-hidden bg-background",
                className
            )}
        >
            {/* Breathing Gradient 1 */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
            />
            {/* Breathing Gradient 2 (Offset) */}
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2 z-0"
            />
            {/* Noise Texture (Disabled until asset available) 
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]" style={{ backgroundImage: "url('/noise.png')" }}></div>
            */}

            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />
            <div className="absolute inset-0 bg-grid-black/[0.02] -z-10 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]" />

            <div className="relative z-10 w-full h-full">{children}</div>
        </div>
    );
});

HeroBackground.displayName = "HeroBackground";
