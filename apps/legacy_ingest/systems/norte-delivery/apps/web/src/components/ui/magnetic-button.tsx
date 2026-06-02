"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const MagneticButton = ({ children, className, ...props }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();

    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.5, y: middleY * 0.5 });

    setTextPosition({ x: middleX * 0.2, y: middleY * 0.2 });

    const x = clientX - left;
    const y = clientY - top;
    setSpotlight({ x, y, opacity: 1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    setTextPosition({ x: 0, y: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center overflow-hidden cursor-pointer", className)}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(120px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.3), transparent 80%)`
        }}
      />
      <motion.span
        className="relative z-10 flex items-center"
        animate={{ x: textPosition.x, y: textPosition.y }}
        transition={{ type: "spring", stiffness: 250, damping: 10, mass: 0.1 }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};
