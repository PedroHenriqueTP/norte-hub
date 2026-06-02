'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, CheckCircle, Plus, Loader2, Sparkles } from 'lucide-react';

type BlockType = 'POMODORO' | 'SHORT_BREAK' | 'LONG_BREAK' | 'CUSTOM';

interface TimeBlock {
  id: string;
  title: string;
  type: BlockType;
  duration: number;
  completed: boolean;
}

interface PomodoroTimerProps {
  onBlockComplete: (blockId: string, timeSpent: number) => void;
  onBlockCreated: () => void;
}

const BLOCK_CONFIGS: Record<BlockType, { label: string; minutes: number; color: string; bg: string }> = {
  POMODORO:    { label: 'Foco',        minutes: 25, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/10' },
  SHORT_BREAK: { label: 'Pausa Curta', minutes: 5,  color: 'text-cyan-400',    bg: 'from-cyan-500/20 to-blue-500/10' },
  LONG_BREAK:  { label: 'Pausa Longa', minutes: 15, color: 'text-indigo-400',  bg: 'from-indigo-500/20 to-purple-500/10' },
  CUSTOM:      { label: 'Livre',       minutes: 30, color: 'text-orange-400',  bg: 'from-orange-500/20 to-amber-500/10' }
};

export function PomodoroTimer({ onBlockComplete, onBlockCreated }: PomodoroTimerProps) {
  const { data: session } = useSession();
  const [activeType, setActiveType] = useState<BlockType>('POMODORO');
  const [seconds, setSeconds] = useState(BLOCK_CONFIGS.POMODORO.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const config = BLOCK_CONFIGS[activeType];
  const totalSeconds = config.minutes * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const resetTimer = useCallback((type: BlockType) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setActiveBlock(null);
    setElapsedSeconds(0);
    setSeconds(BLOCK_CONFIGS[type].minutes * 60);
  }, []);

  const switchType = (type: BlockType) => {
    setActiveType(type);
    resetTimer(type);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const handleStart = async () => {
    if (!session?.accessToken || !newTitle.trim()) {
      setShowCreate(true);
      return;
    }
    if (activeBlock) { setIsRunning(true); return; }
    setCreating(true);
    try {
      const res = await fetch(`${API}/api/personal/norte-clock/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ title: newTitle, type: activeType, duration: config.minutes })
      });
      if (res.ok) {
        const block = await res.json();
        setActiveBlock(block);
        setIsRunning(true);
        setShowCreate(false);
        onBlockCreated();
      }
    } catch { } finally { setCreating(false); }
  };

  const handleComplete = async () => {
    if (!session?.accessToken || !activeBlock) return;
    setIsRunning(false);
    try {
      await fetch(`${API}/api/personal/norte-clock/blocks/${activeBlock.id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ timeSpent: elapsedSeconds })
      });
      onBlockComplete(activeBlock.id, elapsedSeconds);
    } catch { } finally {
      resetTimer(activeType);
      setNewTitle('');
    }
  };

  const handleStop = () => resetTimer(activeType);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/5">
        {(Object.keys(BLOCK_CONFIGS) as BlockType[]).map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 ${
              activeType === type
                ? `bg-gradient-to-r ${BLOCK_CONFIGS[type].bg} ${BLOCK_CONFIGS[type].color} border border-white/10`
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {BLOCK_CONFIGS[type].label}
          </button>
        ))}
      </div>

      <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br ${config.bg} border border-white/5 backdrop-blur-md`}>
        <div className="relative w-52 h-52">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="100" cy="100" r={radius}
              fill="none"
              stroke={activeType === 'POMODORO' ? '#10b981' : activeType === 'SHORT_BREAK' ? '#06b6d4' : activeType === 'LONG_BREAK' ? '#6366f1' : '#f97316'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={seconds}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-5xl font-mono font-bold ${config.color}`}
            >
              {formatTime(seconds)}
            </motion.span>
            <span className="text-xs text-white/30 mt-1 uppercase tracking-widest">{config.label}</span>
          </div>
        </div>

        <AnimatePresence>
          {activeBlock && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 text-sm font-medium text-white/70 text-center truncate max-w-full px-4"
            >
              {activeBlock.title}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(!activeBlock && !isRunning) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              placeholder="Nome do bloco de foco..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleStart(); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={creating || (!activeBlock && !newTitle.trim())}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
              !activeBlock && !newTitle.trim()
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : `bg-gradient-to-r ${config.bg} ${config.color} border border-white/10 hover:brightness-110`
            }`}
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {activeBlock ? 'Continuar' : 'Iniciar Bloco'}
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </button>
        )}

        {activeBlock && (
          <>
            <button
              onClick={handleComplete}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
              title="Concluir bloco"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleStop}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              title="Cancelar"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
