import React from 'react';
import { Section } from '../Section';
import { useUiStore } from '../../../store/uiStore';
import { PassportRegistration } from '../overlays/PassportRegistration';

interface Props {
  bgUrl: string;
}

export const RecepcaoSection: React.FC<Props> = ({ bgUrl }) => {
  const { openOverlay } = useUiStore();

  return (
    <Section id="recepcao" bgUrl={bgUrl}>
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
          Claro <span className="text-[#ee1d23]">Conecta</span>
        </h1>
        <p className="text-xl md:text-3xl font-light text-white/80 max-w-2xl mx-auto mb-8">
          O futuro da inovação e da tecnologia em um só lugar.
        </p>
        <button 
          onClick={() => openOverlay(<PassportRegistration />)}
          className="bg-[#ee1d23] hover:bg-[#ee1d23]/80 text-white px-10 py-5 rounded-full font-bold text-xl uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_30px_rgba(238,29,35,0.4)]"
        >
          Participe da Jornada
        </button>
      </div>
    </Section>
  );
};
