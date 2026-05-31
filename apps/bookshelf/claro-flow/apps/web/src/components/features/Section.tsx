'use client';

import React from 'react';
import { motion } from 'framer-motion';

type SectionProps = {
  id: string;
  bgUrl?: string;
  children: React.ReactNode;
  isActive?: boolean;
};

export const Section: React.FC<SectionProps> = ({ id, bgUrl, children, isActive }) => {
  return (
    <section 
      id={id} 
      className="w-full h-screen snap-start relative overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Background with subtle parallax/fade effect */}
      {bgUrl && (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          viewport={{ once: false, margin: '-20%' }}
        />
      )}
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Content Container */}
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start justify-center h-full"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: false, margin: '-10%' }}
      >
        {children}
      </motion.div>
    </section>
  );
};
