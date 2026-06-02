'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Clock, Flame, CheckCircle2, Bell, Sparkles, BookOpen } from 'lucide-react';
import { PomodoroTimer } from '../../../components/personal/clock/PomodoroTimer';
import { AlarmList } from '../../../components/personal/clock/AlarmList';

interface Summary {
  totalBlocks: number;
  completedBlocks: number;
  totalFocusMinutes: number;
  activeAlarms: number;
}

interface TimeBlock {
  id: string;
  title: string;
  type: string;
  duration: number;
  timeSpent: number;
  completed: boolean;
  createdAt: string;
}

interface Alarm {
  id: string;
  title: string;
  time: string;
  days: string;
  isActive: boolean;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  delay
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="relative p-5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden group hover:border-white/10 transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} to-transparent`} />
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">{label}</span>
          <span className="text-3xl font-bold font-mono text-white">{value}</span>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} opacity-70`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

const TYPE_LABELS: Record<string, string> = {
  POMODORO: 'Foco', SHORT_BREAK: 'Pausa Curta', LONG_BREAK: 'Pausa Longa', CUSTOM: 'Livre'
};
const TYPE_COLORS: Record<string, string> = {
  POMODORO: 'text-emerald-400 bg-emerald-500/10',
  SHORT_BREAK: 'text-cyan-400 bg-cyan-500/10',
  LONG_BREAK: 'text-indigo-400 bg-indigo-500/10',
  CUSTOM: 'text-orange-400 bg-orange-500/10'
};

export default function ClockPage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [blocks, setBlocks] = useState<TimeBlock[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const fetchAll = useCallback(async () => {
    if (!session?.accessToken) return;
    const headers = { Authorization: `Bearer ${session.accessToken}` };
    try {
      const [summaryRes, blocksRes, alarmsRes] = await Promise.all([
        fetch(`${API}/api/personal/norte-clock/summary`, { headers }),
        fetch(`${API}/api/personal/norte-clock/blocks`, { headers }),
        fetch(`${API}/api/personal/norte-clock/alarms`, { headers })
      ]);
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (blocksRes.ok) setBlocks(await blocksRes.json());
      if (alarmsRes.ok) setAlarms(await alarmsRes.json());
    } catch { } finally { setLoadingSummary(false); }
  }, [session, API]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const todayBlocks = blocks.filter(
    (b) => new Date(b.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Norte Clock <Clock className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-white/60">Gestão de foco, Pomodoro e rotinas de alta performance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs text-white/40">Cortex analisa seu padrão de foco em breve</span>
        </div>
      </motion.div>

      {loadingSummary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Minutos de Foco" value={summary?.totalFocusMinutes ?? 0} icon={Flame} color="from-emerald-500/20" delay={0} />
          <KpiCard label="Blocos Concluídos" value={summary?.completedBlocks ?? 0} icon={CheckCircle2} color="from-teal-500/20" delay={0.08} />
          <KpiCard label="Blocos Totais" value={summary?.totalBlocks ?? 0} icon={BookOpen} color="from-cyan-500/20" delay={0.16} />
          <KpiCard label="Alarmes Ativos" value={summary?.activeAlarms ?? 0} icon={Bell} color="from-indigo-500/20" delay={0.24} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md space-y-6"
        >
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Timer Pomodoro
          </h2>
          <PomodoroTimer
            onBlockComplete={() => fetchAll()}
            onBlockCreated={() => fetchAll()}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
            <AlarmList alarms={alarms} onUpdate={fetchAll} />
          </div>

          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Blocos de Hoje
            </h2>
            {todayBlocks.length === 0 ? (
              <p className="text-sm text-white/30 py-4 text-center">Nenhum bloco iniciado hoje.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {todayBlocks.map((block, i) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      block.completed
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${block.completed ? 'text-emerald-400' : 'text-white/15'}`} />
                      <span className={`text-sm truncate ${block.completed ? 'text-white/70 line-through' : 'text-white/80'}`}>
                        {block.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[block.type] ?? 'text-white/30 bg-white/5'}`}>
                        {TYPE_LABELS[block.type] ?? block.type}
                      </span>
                      {block.completed && (
                        <span className="text-xs text-white/30 font-mono">
                          {Math.floor(block.timeSpent / 60)}m
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
