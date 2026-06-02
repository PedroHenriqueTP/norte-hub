'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Sparkles, AlertTriangle, Apple, Flame } from 'lucide-react';

interface RecommendedMeal {
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
}

interface InsightData {
  insights: string[];
  recommendedMeals: RecommendedMeal[];
}

interface DietInsightPanelProps {
  dietLogs: Array<{ food: string; calories: number; carbs: number; protein: number; fat: number }>;
}

export function DietInsightPanel({ dietLogs }: DietInsightPanelProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/hub/cortex/diet-insight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ dietLogs })
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Assinatura ativa do Norte Fit necessaria para usar esta funcionalidade.');
        }
        throw new Error('Falha ao gerar insights de dieta.');
      }

      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Norte Fit Cortex <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
          </h3>
          <p className="text-xs text-white/40">Analise nutricional preditiva baseada em IA</p>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/10"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Analisando...' : 'Analisar Dieta'}</span>
        </button>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-xs text-white/40 animate-pulse">
            <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <span>Processando logs alimentares com o Cortex...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {insight && !loading && (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block">Diagnostico e Recomendacoes</span>
            <div className="space-y-2">
              {insight.insights?.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-sm text-white/80">
                  <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block">Sugestao de Refeicoes Limpas</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insight.recommendedMeals?.map((meal, idx) => (
                <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-semibold text-white/90 flex items-center gap-1.5">
                      <Apple className="w-4 h-4 text-emerald-400" />
                      {meal.name}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {meal.calories} kcal
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <span className="text-[10px] text-white/40 block font-semibold">CARB</span>
                      <span className="text-xs font-mono font-semibold text-white/80">{meal.carbs}g</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <span className="text-[10px] text-white/40 block font-semibold">PROT</span>
                      <span className="text-xs font-mono font-semibold text-white/80">{meal.protein}g</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <span className="text-[10px] text-white/40 block font-semibold">GORD</span>
                      <span className="text-xs font-mono font-semibold text-white/80">{meal.fat}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
