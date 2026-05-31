'use client';

import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { BrandButton } from '../common/BrandButton';
import { useTelemetryStore } from '../../store/useTelemetryStore';

export const HeroCarousel = () => {
  const trackClick = useTelemetryStore(state => state.trackClick);

  return (
    <div className="w-full mb-6">
      <GlassCard padding="none" className="overflow-hidden relative h-[400px] md:h-[500px] group">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050000] via-[#050000]/80 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070")' }}
        />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 z-10 opacity-10 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }} />

        <div className="relative z-20 h-full p-8 md:p-12 flex flex-col justify-center max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#ee1d23] animate-pulse shadow-[0_0_10px_rgba(238,29,35,0.8)]" />
            <span className="text-[#ee1d23] font-bold text-sm tracking-wider uppercase">Live Stream</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            O Futuro da<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8a8f98]">Conectividade.</span>
          </h1>
          
          <p className="text-[#8a8f98] text-lg md:text-xl mb-8 leading-relaxed max-w-xl">
            Acompanhe as novidades da Claro no palco principal da Bienal. Acesso VIP aos bastidores do evento, mapas em tempo real e jogos exclusivos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <BrandButton 
              variant="primary" 
              onClick={(e) => trackClick('WATCH_LIVE', e.clientX, e.clientY)}
              className="px-8"
            >
              Assistir Agora
            </BrandButton>
            <BrandButton 
              variant="secondary" 
              onClick={(e) => trackClick('PROGRAMACAO', e.clientX, e.clientY)}
              className="px-8 backdrop-blur-md"
            >
              Programação Completa
            </BrandButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
