'use client';

import { useEffect, useState } from 'react';

export default function VigiaPerformance() {
  const [workout, setWorkout] = useState<any>(null);
  const [diet, setDiet] = useState<any>(null);

  useEffect(() => {
    // Simulando a busca dos dados do backend
    // Em produção, bateríamos nos endpoints reais de treino e dieta
    setWorkout({
      title: 'PPL - Pull Day',
      exercise: 'Levantamento Terra',
      weight: 160,
      reps: 3,
    });
    
    setDiet({
      meal: 'Barbecue Brasileiro',
      protein: 80,
      calories: 1200,
    });
  }, []);

  return (
    <div className="border border-orange-500/30 bg-black p-6 rounded-lg shadow-lg shadow-orange-500/10 hover:border-emerald-500 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Vigía Performance</h2>
        <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">
          MODO WAR
        </span>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Último PR ({workout?.exercise}):</span>
            <span className="text-orange-400 font-mono font-bold">{workout?.weight} kg</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: '80%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Proteína Ingerida:</span>
            <span className="text-orange-400 font-mono font-bold">{diet?.protein}g / 200g</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-[10px] text-emerald-400 font-mono">
        [SYSTEM]: Dados de performance sincronizados.
      </div>
    </div>
  );
}
