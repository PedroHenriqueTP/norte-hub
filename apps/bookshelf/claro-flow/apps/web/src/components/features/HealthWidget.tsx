'use client';

import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const HealthWidget = () => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="w-full mt-4 glass-chic border-t border-[#ee1d23]/50 bg-black/60 backdrop-blur-md px-6 py-3 flex items-center justify-between rounded-xl relative overflow-hidden shadow-[0_-5px_20px_rgba(238,29,35,0.15)]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#ee1d23] to-transparent"></div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[#ee1d23]">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="font-bold text-xs tracking-widest uppercase">System Health</span>
        </div>
        
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <div className="flex items-center gap-2">
            <p className="text-[#8a8f98] text-[10px] uppercase">Uptime</p>
            <p className="text-white font-mono text-xs font-bold">{formatUptime(uptime)}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[#8a8f98] text-[10px] uppercase">Healed</p>
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <p className="text-white font-mono text-xs font-bold">0</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-[#ee1d23]/10 border border-[#ee1d23]/20 px-3 py-1 rounded flex items-center gap-2">
          <AlertTriangle className="w-3 h-3 text-[#ee1d23]" />
          <span className="text-[#ee1d23] text-[10px] font-bold uppercase tracking-wider">Chaos Monkey Ativo</span>
        </div>
        <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20 font-bold tracking-wider">
          ALL NOMINAL
        </span>
      </div>
    </div>
  );
};
