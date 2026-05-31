import React from 'react';
import { Section } from '../Section';
import { useUiStore } from '../../../store/uiStore';
import { GameOverlay } from '../overlays/GameOverlay';

interface Props {
  bgUrl: string;
}

export const AwardsSection: React.FC<Props> = ({ bgUrl }) => {
  const { openOverlay } = useUiStore();

  return (
    <Section id="evento-3" bgUrl={bgUrl}>
      <div className="text-center max-w-4xl mx-auto">
        <p className="text-[#ee1d23] font-bold tracking-widest uppercase mb-4">Encerramento & Gamificação</p>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Awards: Os Destaques do Ano.
        </h2>
        <div className="flex justify-center gap-4">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors">
            Descobrir Vencedores
          </button>
          <button 
            onClick={() => openOverlay(<GameOverlay />)}
            className="bg-[#ee1d23] hover:bg-[#ee1d23]/80 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-[0_0_20px_rgba(238,29,35,0.4)]"
          >
            Jogar Agora
          </button>
        </div>
      </div>
    </Section>
  );
};
