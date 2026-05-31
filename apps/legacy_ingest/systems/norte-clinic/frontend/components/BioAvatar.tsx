"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AvatarState = "idle" | "busy" | "error";

interface BioAvatarProps {
    state?: AvatarState;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function BioAvatar({ state = "idle", className, size = "md" }: BioAvatarProps) {
    const [pulseSpeed, setPulseSpeed] = useState(2);

    useEffect(() => {
        switch (state) {
            case "busy":
                setPulseSpeed(0.5); // Fast pulse
                break;
            case "error":
                setPulseSpeed(0.2); // Very fast / erratic
                break;
            default:
                setPulseSpeed(3); // Slow, calm breathing
        }
    }, [state]);

    const colors = {
        idle: "bg-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.5)]",
        busy: "bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]",
        error: "bg-red-400 shadow-[0_0_20px_rgba(248,113,113,0.5)]",
    };

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Core Nucleus */}
            <motion.div
                className={cn(
                    "rounded-full z-10 border-2 border-white/30 backdrop-blur-sm",
                    colors[state],
                    sizeClasses[size]
                )}
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Outer Membrane (Ripple 1) */}
            <motion.div
                className={cn(
                    "absolute rounded-full opacity-50",
                    colors[state],
                    sizeClasses[size]
                )}
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            />

            {/* Outer Membrane (Ripple 2) */}
            <motion.div
                className={cn(
                    "absolute rounded-full opacity-30",
                    colors[state],
                    sizeClasses[size]
                )}
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                }}
                transition={{
                    duration: pulseSpeed + 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                }}
            />
        </div>
    );
}
