import React from 'react';
import { Section } from '../Section';
import { useUiStore } from '../../../store/uiStore';

interface Props {
  bgUrl: string;
}

export const TechSection: React.FC<Props> = ({ bgUrl }) => {
  const { openOverlay } = useUiStore();

  const handleViewSchedule = () => {
    openOverlay(
      <div>
        <h3 className="text-3xl font-bold text-white mb-4">Programação do Painel</h3>
        <ul className="space-y-4 text-left">
          <li className="glass-chic p-4 rounded-xl border border-white/10">10:00 - Abertura 5G</li>
          <li className="glass-chic p-4 rounded-xl border border-white/10">11:30 - Edge Computing na Prática</li>
          <li className="glass-chic p-4 rounded-xl border border-white/10">14:00 - Q&A com Especialistas</li>
        </ul>
      </div>
    );
  };

  return (
    <Section id="evento-2" bgUrl={bgUrl}>
      <div className="max-w-4xl ml-auto text-right">
        <p className="text-[#ee1d23] font-bold tracking-widest uppercase mb-4">Painel Técnico</p>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Inovação em 5G & Edge Computing.
        </h2>
        <button 
          onClick={handleViewSchedule}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors"
        >
          Ver Programação
        </button>
      </div>
    </Section>
  );
};
