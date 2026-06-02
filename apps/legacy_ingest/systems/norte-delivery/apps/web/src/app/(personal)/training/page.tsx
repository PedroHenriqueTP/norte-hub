'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Plus, CheckCircle, Trash2, Loader2,
  Trophy, BarChart3, Flame, Target, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalSessions: number;
  completedSessions: number;
  totalVolumeKg: number;
  personalRecords: { name: string; best: number }[];
}

interface TrainingSession {
  id: string;
  name: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  exercises: { id: string; name: string; sets: number; reps: number; weightKg: number }[];
}

function StatCard({ label, value, icon: Icon, color, delay }: {
  label: string; value: string | number; icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: 'easeOut' }}
      className="p-5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${color} to-transparent`} />
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

export default function TrainingPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', notes: '' });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const fetchAll = useCallback(async () => {
    if (!session?.accessToken) return;
    const h = { Authorization: `Bearer ${session.accessToken}` };
    try {
      const [sRes, sessRes] = await Promise.all([
        fetch(`${API}/api/personal/norte-training/stats`, { headers: h }),
        fetch(`${API}/api/personal/norte-training/sessions`, { headers: h })
      ]);
      if (sRes.ok) setStats(await sRes.json());
      if (sessRes.ok) setSessions(await sessRes.json());
    } catch { } finally { setLoading(false); }
  }, [session, API]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !form.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API}/api/personal/norte-training/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ name: form.name, notes: form.notes || undefined })
      });
      if (res.ok) { setShowCreate(false); setForm({ name: '', notes: '' }); fetchAll(); }
    } catch { } finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/api/personal/norte-training/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setSessions((p) => p.filter((s) => s.id !== id));
      fetchAll();
    } catch { } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Norte Training <Dumbbell className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-white/60">Rotinas de alta performance e histórico de cargas</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10">
          <Plus className="w-4 h-4" /> Nova Sessão
        </button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Sessões Totais" value={stats?.totalSessions ?? 0} icon={BarChart3} color="from-emerald-500/20" delay={0} />
          <StatCard label="Concluídas" value={stats?.completedSessions ?? 0} icon={CheckCircle} color="from-teal-500/20" delay={0.07} />
          <StatCard label="Volume Total (kg)" value={stats?.totalVolumeKg ?? 0} icon={Flame} color="from-cyan-500/20" delay={0.14} />
          <StatCard label="Exercícios Logados" value={sessions.reduce((s, se) => s + se.exercises.length, 0)} icon={Target} color="from-indigo-500/20" delay={0.21} />
        </div>
      )}

      {stats && stats.personalRecords.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" /> Recordes Pessoais
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.personalRecords.map((pr, i) => (
              <div key={pr.name} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                <span className="text-[10px] text-white/30 uppercase block mb-1">#{i + 1}</span>
                <span className="text-xs font-semibold text-white/80 block truncate">{pr.name}</span>
                <span className="text-lg font-bold font-mono text-yellow-400">{pr.best}kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Histórico de Sessões</h2>
        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />)}</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-2xl">
            <Dumbbell className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <span className="text-sm text-white/30 block">Nenhuma sessão registrada.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {sessions.map((sess, i) => (
                <motion.div key={sess.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center justify-between p-4 rounded-xl border group hover:border-white/10 transition-all ${
                    sess.completedAt ? 'border-emerald-500/15 bg-emerald-500/[0.03]' : 'border-white/5 bg-white/[0.02]'
                  }`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-2 rounded-lg ${sess.completedAt ? 'bg-emerald-500/15' : 'bg-white/5'}`}>
                      <Dumbbell className={`w-4 h-4 ${sess.completedAt ? 'text-emerald-400' : 'text-white/30'}`} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-white/90 block truncate">{sess.name}</span>
                      <span className="text-xs text-white/30">
                        {sess.exercises.length} exercício{sess.exercises.length !== 1 ? 's' : ''} · {new Date(sess.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {sess.completedAt && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Concluída</span>
                    )}
                    <Link href={`/training/${sess.id}`}
                      className="p-2 text-white/30 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(sess.id)} disabled={deletingId === sess.id}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      {deletingId === sess.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleCreate}
              className="bg-black/95 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-emerald-400" /> Nova Sessão
              </h3>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Nome da Sessão</label>
                <input type="text" required placeholder="Ex: Peito e Tríceps"
                  value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Observações</label>
                <textarea placeholder="Notas opcionais..." value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" disabled={creating || !form.name.trim()}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-lg transition-colors flex items-center gap-2">
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Criar
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
