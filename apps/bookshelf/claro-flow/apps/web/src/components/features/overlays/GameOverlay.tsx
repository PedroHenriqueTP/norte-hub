import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Gamepad2 } from 'lucide-react';

export const GameOverlay = () => {
  const { closeOverlay } = useUiStore();

  return (
    <div className="flex flex-col items-center justify-center text-center h-[60vh] min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-[#ee1d23]/20 flex items-center justify-center mb-6 animate-pulse">
        <Gamepad2 className="w-10 h-10 text-[#ee1d23]" />
      </div>
      <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Conexão Interativa</h3>
      <p className="text-xl text-white/70 mb-8 max-w-lg">
        Prepare-se para testar seus conhecimentos sobre conectividade. Os 10 melhores do ranking levam prêmios exclusivos.
      </p>

      <div className="flex gap-4">
        <button className="bg-[#ee1d23] hover:bg-[#ee1d23]/80 text-white px-8 py-4 rounded-full font-bold transition-colors uppercase tracking-wider shadow-[0_0_20px_rgba(238,29,35,0.4)]">
          Iniciar Desafio
        </button>
        <button 
          onClick={closeOverlay}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-colors border border-white/20 uppercase tracking-wider"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};
