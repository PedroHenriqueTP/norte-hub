"use client";

import React, { useState } from "react";
import { Play, Pause, Maximize, Volume2, Settings } from "lucide-react";

type VideoProps = {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
};

export function NorteVideoPlayer({ src, title, onProgress, onComplete }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock de lógica de player customizado estilo TikTok/Shorts ou Aulas
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      simulateProgress();
    }
  };

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (onProgress) onProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsPlaying(false);
        if (onComplete) onComplete();
      }
    }, 1000);
  };

  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-xl overflow-hidden group shadow-2xl border border-slate-800">
      {/* Video Simulado */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs opacity-50 rotate-[-90deg] whitespace-nowrap">
          {title}
        </span>
      </div>

      {/* Overlay Escuro para o UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

      {/* Título e Info (Top) */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <p className="text-white text-xs font-bold truncate max-w-[200px]">{title}</p>
        </div>
        <button className="text-white/70 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>

      {/* Center Play Button */}
      {!isPlaying && (
        <button 
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all z-10 pointer-events-auto hover:scale-110"
        >
          <Play className="text-white ml-1" size={32} />
        </button>
      )}

      {/* Controles Base (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Barra de Progresso */}
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botões Inferiores */}
        <div className="flex items-center justify-between text-white mt-1">
          <button onClick={togglePlay} className="hover:text-emerald-400 transition-colors">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <div className="flex items-center gap-4">
            <button className="hover:text-emerald-400 transition-colors"><Volume2 size={20} /></button>
            <button className="hover:text-emerald-400 transition-colors"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
