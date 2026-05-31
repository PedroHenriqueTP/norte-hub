import React from 'react';
import { Section } from '../Section';
import { useUiStore } from '../../../store/uiStore';

interface Props {
  bgUrl: string;
}

export const KeynoteSection: React.FC<Props> = ({ bgUrl }) => {
  const { openOverlay } = useUiStore();

  const handleWatchNow = () => {
    openOverlay(
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Transmissão ao Vivo</h3>
        <div className="aspect-video bg-black/80 rounded-xl border border-white/20 flex items-center justify-center">
          <span className="text-white/50">Player do Keynote aqui</span>
        </div>
      </div>
    );
  };

  return (
    <Section id="evento-1" bgUrl={bgUrl}>
      <div className="max-w-4xl">
        <p className="text-[#ee1d23] font-bold tracking-widest uppercase mb-4">Palco Principal</p>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Keynote: A Nova Era da Conectividade.
        </h2>
        <button 
          onClick={handleWatchNow}
          className="bg-[#ee1d23] hover:bg-[#ee1d23]/80 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
        >
          Assistir Agora
        </button>
      </div>
    </Section>
  );
};
