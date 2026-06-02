"use client";

import React, { useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  className?: string;
  src: string;
  alt: string;
  depth?: number;
}

const NextImage = Image as any;

export const FloatingElement = ({ className, src, alt, depth = 20 }: FloatingElementProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xPct = (clientX / innerWidth - 0.5) * 2;
    const yPct = (clientY / innerHeight - 0.5) * 2;

    x.set(xPct * depth);
    y.set(yPct * depth);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative will-change-transform Perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: useTransform(y, (value) => value * -1.5),
        rotateY: useTransform(x, (value) => value * 1.5),
        x,
        y,
      }}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <div className="relative drop-shadow-2xl">
        <NextImage
          src={src}
          alt={alt}
          width={600}
          height={600}
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
};
