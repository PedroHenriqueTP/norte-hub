'use client';

import { useState } from 'react';
import { BioStatus } from '@/components/dashboard/BioStatus';
import { VirilizationCard } from '@/components/dashboard/VirilizationCard';
import { getFitData, updateCarga } from '@/lib/mockData';

export default function FitDashboard() {
  const initialData = getFitData();
  const [carga, setCarga] = useState(initialData.cargaTotal);

  const handleTreinoCompleto = () => {
    setCarga(updateCarga(carga, 150)); // Simula ganho de carga
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-12 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <BioStatus />
        <div className="space-y-8">
          <header>
            <h1 className="text-5xl font-black tracking-tighter mb-4">Norte <span className="text-emerald-400">Fit</span></h1>
            <p className="text-white/60 text-lg max-w-md">Bio-monitoramento de performance bruta. Otimização hormonal via densidade nutricional.</p>
          </header>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Carga Total Acumulada</span>
            <p className="text-4xl font-black text-white">{carga} <span className="text-emerald-400">kg</span></p>
          </div>

          <VirilizationCard animalRatio={initialData.virilizacao} />
          
          <button 
            onClick={handleTreinoCompleto}
            className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
          >
            Registrar Treino (+150kg)
          </button>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <p className="text-sm text-emerald-400 font-medium">
              💡 Dica Pro: O consumo atual de carne vermelha suporta a síntese de testosterona e força máxima para o treino de hoje.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
