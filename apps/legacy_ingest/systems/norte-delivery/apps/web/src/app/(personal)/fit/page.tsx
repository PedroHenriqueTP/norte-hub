'use client';

import React, { useState } from 'react';
import { DietInsightPanel } from '../../../components/DietInsightPanel';
import { Plus, Dumbbell } from 'lucide-react';

export default function FitPage() {
  const [meals, setMeals] = useState([
    { food: 'Arroz Integral', carbs: 45, protein: 4, fat: 1, calories: 205 },
    { food: 'Frango Grelhado', carbs: 0, protein: 31, fat: 3, calories: 165 },
    { food: 'Ovo Cozido', carbs: 1, protein: 6, fat: 5, calories: 78 }
  ]);

  const [food, setFood] = useState('');
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [calories, setCalories] = useState(0);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!food.trim()) return;
    setMeals((prev) => [...prev, { food, carbs, protein, fat, calories }]);
    setFood('');
    setCarbs(0);
    setProtein(0);
    setFat(0);
    setCalories(0);
  };

  const totalCarbs = meals.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = meals.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = meals.reduce((sum, item) => sum + item.fat, 0);
  const totalCalories = meals.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          Norte Fit <Dumbbell className="w-6 h-6 text-emerald-400" />
        </h1>
        <p className="text-sm text-white/60">
          Acompanhamento de macros e performance pessoal da holding Norte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Calorias Totais</span>
          <span className="text-2xl font-mono font-bold text-white">{totalCalories} kcal</span>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Carboidratos</span>
          <span className="text-2xl font-mono font-bold text-emerald-400">{totalCarbs}g</span>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Proteinas</span>
          <span className="text-2xl font-mono font-bold text-teal-400">{totalProtein}g</span>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Gorduras</span>
          <span className="text-2xl font-mono font-bold text-cyan-400">{totalFat}g</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Adicionar Alimento</h3>
            <form onSubmit={handleAddMeal} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Nome do alimento"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Carb (g)"
                  value={carbs || ''}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Prot (g)"
                  value={protein || ''}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Gord (g)"
                  value={fat || ''}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Cal (kcal)"
                  value={calories || ''}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </form>
          </div>

          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Refeicoes de Hoje</h3>
            <div className="space-y-3">
              {meals.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 text-sm">
                  <span className="text-white/80 font-medium">{item.food}</span>
                  <span className="text-xs font-mono text-white/40">
                    C: {item.carbs}g | P: {item.protein}g | G: {item.fat}g
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <DietInsightPanel dietLogs={meals} />
        </div>
      </div>
    </div>
  );
}
