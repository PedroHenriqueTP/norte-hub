"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Scissors, Wand2, UploadCloud, Film, Music, Cpu, Mic, Volume2 } from "lucide-react";
import { toast } from "sonner";

export function NorteStudioEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  // Mocks para simular a UI amorfa do Estúdio
  const stems = [
    { name: "Vocal", color: "bg-orange-500", active: true },
    { name: "Drums (Funk)", color: "bg-orange-600", active: true },
    { name: "Bass", color: "bg-orange-700", active: true },
    { name: "Synths", color: "bg-orange-800", active: false }
  ];

  const handleSplitter = () => {
    setIsSplitting(true);
    toast("🤖 The Splitter ativado: Isolando vocais e batida...", { icon: <Cpu className="text-orange-500 animate-pulse" /> });
    
    setTimeout(() => {
      setIsSplitting(false);
      toast.success("Stems separados com sucesso!", {
        description: "Bateria de Funk isolada a 130 BPM."
      });
    }, 3000);
  };

  const handleVeoVideo = () => {
    setIsGeneratingVideo(true);
    toast("🎥 Veo Engine processando prompt...", { icon: <Film className="text-purple-500 animate-pulse" /> });
    
    setTimeout(() => {
      setIsGeneratingVideo(false);
      toast.success("Vídeo Gerado!", {
        description: "Clipe renderizado na nuvem e disponível no SaaS Maker."
      });
    }, 4000);
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl">
      
      {/* Esquerda: Áudio Engine (Timeline e Stems) */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Music className="text-orange-500"/> The Sound Engine
            </h2>
            <p className="text-slate-400 text-sm">Produção: Funk / Trap | Key: C Min | BPM: 130</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSplitter}
              disabled={isSplitting}
              className="bg-slate-900 border border-slate-700 hover:border-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <Scissors size={16} className={isSplitting ? "animate-spin text-orange-500" : "text-slate-400"} />
              {isSplitting ? "Separando..." : "AI Splitter (Stems)"}
            </button>
          </div>
        </div>

        {/* Timeline Visual (Mock) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden">
          {/* Waveforms */}
          <div className="space-y-3 relative z-10">
            {stems.map((stem, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 flex items-center justify-between shrink-0">
                  <span className={`text-xs font-bold ${stem.active ? 'text-white' : 'text-slate-600'}`}>{stem.name}</span>
                  <button className={`w-6 h-6 rounded-md flex items-center justify-center ${stem.active ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-600'}`}>
                    {stem.name === "Vocal" ? <Mic size={12}/> : <Volume2 size={12}/>}
                  </button>
                </div>
                {/* Simulated Waveform Bar */}
                <div className="flex-1 h-8 bg-black/40 rounded-lg overflow-hidden flex items-center px-1 gap-[2px]">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className={`w-full rounded-sm ${stem.active ? stem.color : 'bg-slate-800'}`}
                      style={{ 
                        height: `${Math.max(10, Math.random() * (stem.active ? 100 : 30))}%`,
                        opacity: stem.active ? 0.8 : 0.3
                      }}
                      animate={isPlaying && stem.active ? { height: [`${Math.max(10, Math.random() * 100)}%`, `${Math.max(10, Math.random() * 100)}%`] } : {}}
                      transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-800">
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg transition-colors shadow-orange-500/20"
            >
              {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Direita: Vídeo Engine (Veo) */}
      <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Film className="text-purple-500"/> Visual Engine
          </h2>
          <p className="text-slate-400 text-sm">Geração Veo / Auto-Cortes</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          <div className="aspect-[9/16] bg-black rounded-xl border border-slate-800 relative overflow-hidden group">
            {isGeneratingVideo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <Wand2 className="text-purple-500 animate-bounce mb-2" size={32} />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Renderizando IA...</span>
              </div>
            ) : (
              <>
                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Video Preview"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <p className="text-white font-bold text-sm shadow-black">Draft: Drop de Funk 130BPM</p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors h-24 resize-none"
              placeholder="Prompt para o Veo Engine: Videoclipe dinâmico em neon 4k acompanhando a batida..."
              defaultValue="Videoclipe dinâmico em estilo cyberpunk acompanhando a batida do drop do vocal isolado."
            ></textarea>
            
            <button 
              onClick={handleVeoVideo}
              disabled={isGeneratingVideo}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Wand2 size={18} /> {isGeneratingVideo ? "Gerando..." : "Gerar com Veo Engine"}
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <UploadCloud size={18} /> Exportar para SaaS Maker
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
