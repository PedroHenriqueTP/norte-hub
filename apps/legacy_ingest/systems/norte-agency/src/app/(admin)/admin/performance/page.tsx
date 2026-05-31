import React from "react";
import { NorteWorkoutBuilder } from "@/components/performance/NorteWorkoutBuilder";

export default function PerformanceHubPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Norte Performance (Wellness & Productivity)
        </h1>
        <p className="text-slate-400 mt-1">
          Onde a Biologia Humana encontra a Escala Digital. Monte rotinas de Treino e colha os frutos no Marketplace.
        </p>
      </div>
      <NorteWorkoutBuilder routineId="demo-routine-ppl" />
    </div>
  );
}
