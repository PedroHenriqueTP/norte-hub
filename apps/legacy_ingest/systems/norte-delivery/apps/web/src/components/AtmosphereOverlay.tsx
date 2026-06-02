'use client';
import { motion } from 'framer-motion';

export const AtmosphereOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Simulação de 'Floating Dust/Leaves' */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%', 
            opacity: Math.random() * 0.5 
          }}
          animate={{ 
            y: '-10%', 
            x: `calc(${Math.random() * 100}% + 50px)`,
            rotate: 360 
          }}
          transition={{ 
            duration: Math.random() * 20 + 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};
