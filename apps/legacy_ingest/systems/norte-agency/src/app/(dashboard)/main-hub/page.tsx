"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, DollarSign, HeartPulse, Sparkles, Megaphone, Terminal, BrainCircuit, Wand2 } from "lucide-react";

export default function MainHubPage() {
  const [isHoveringAi, setIsHoveringAi] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">AXIS <span className="text-slate-500 font-medium">Gateway</span></h1>
            <p className="text-slate-400 text-sm mt-1">O Sistema Nervoso Central</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-bold text-slate-300">Sistemas Operacionais</span>
            </div>
            <img src="https://i.pravatar.cc/150?u=pedrao" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Avatar"/>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Central AI Hub (The Core) */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
            <div 
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]"
              onMouseEnter={() => setIsHoveringAi(true)}
              onMouseLeave={() => setIsHoveringAi(false)}
            >
              {/* Córtex Neural Orb */}
              <motion.div 
                className="w-48 h-48 rounded-full flex items-center justify-center relative mb-8 cursor-pointer"
                animate={{ 
                  scale: isHoveringAi ? 1.05 : 1,
                  boxShadow: isHoveringAi ? "0 0 80px rgba(139, 92, 246, 0.4)" : "0 0 40px rgba(139, 92, 246, 0.2)"
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-tr from-slate-900 to-black rounded-full border border-slate-800 z-10 flex items-center justify-center">
                  <BrainCircuit size={64} className={isHoveringAi ? "text-violet-400" : "text-slate-500"} />
                </div>
                
                {/* Orbital Rings */}
                <motion.div 
                  className="absolute inset-[-20px] rounded-full border border-violet-500/30 border-dashed"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-[-40px] rounded-full border border-cyan-500/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              <h2 className="text-3xl font-black text-white text-center">Norte Core Intelligence</h2>
              <p className="text-slate-400 text-center max-w-md mt-2">
                "Olá Pedrão. O Enterprise Payroll foi liquidado e a sua rotina PPL está pronta. O que deseja orquestrar agora?"
              </p>
            </div>

            {/* Sub Tentáculos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <DollarSign className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold mb-1">Fintech & Enterprise</h3>
                <p className="text-slate-500 text-sm">Ledger, Payroll e Digital Wallet</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <HeartPulse className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold mb-1">Health & Bio</h3>
                <p className="text-slate-500 text-sm">Prontuários e Performance PPL</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <Wand2 className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                <h3 className="text-white font-bold mb-1">SaaS Maker</h3>
                <p className="text-slate-500 text-sm">Morphic Engine & UX Lab</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Live Pulse */}
          <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="text-cyan-500" /> Live Pulse (Norte Stream)
              </h3>
              
              <div className="flex flex-col gap-4 flex-1">
                {/* Event 1 */}
                <div className="flex gap-4 items-start relative pb-4">
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/50 z-10">
                    <DollarSign size={12} className="text-emerald-500"/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Venda Confirmada</h4>
                    <p className="text-xs text-slate-400 mt-1">SaaS de Clínica de Estética vendido via Marketplace. +R$ 3.500</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">Há 2 minutos</span>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex gap-4 items-start relative pb-4">
                  <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800"></div>
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 border border-violet-500/50 z-10">
                    <Megaphone size={12} className="text-violet-500"/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Automação de Conteúdo</h4>
                    <p className="text-xs text-slate-400 mt-1">Reels gerado pela I.A. postado no Instagram @pedrao. 15 curtidas.</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">Há 15 minutos</span>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex gap-4 items-start relative">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/50 z-10">
                    <Terminal size={12} className="text-blue-500"/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Dev-Sync</h4>
                    <p className="text-xs text-slate-400 mt-1">1000 linhas commitadas. Córtex Neural atualizou o context-map.json no VS Code.</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">Há 1 hora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
