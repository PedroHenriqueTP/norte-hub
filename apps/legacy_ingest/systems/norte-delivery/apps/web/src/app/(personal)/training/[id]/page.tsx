'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Trash2, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ExerciseLog {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
  notes?: string;
}

interface SessionDetail {
  id: string;
  name: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  exercises: ExerciseLog[];
}

export default function SessionDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const sessionId = params?.id as string;
  const [detail, setDetail] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', sets: '3', reps: '10', weightKg: '0', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const fetchDetail = useCallback(async () => {
    if (!session?.accessToken || !sessionId) return;
    try {
      const res = await fetch(`${API}/api/personal/norte-training/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) setDetail(await res.json());
    } catch { } finally { setLoading(false); }
  }, [session, sessionId, API]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  const handleComplete = async () => {
    if (!session?.accessToken || !sessionId) return;
    setCompleting(true);
    try {
      await fetch(`${API}/api/personal/norte-training/sessions/${sessionId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      fetchDetail();
    } catch { } finally { setCompleting(false); }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/personal/norte-training/sessions/${sessionId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({
          name: form.name,
          sets: parseInt(form.sets),
          reps: parseInt(form.reps),
          weightKg: parseFloat(form.weightKg),
          notes: form.notes || undefined
        })
      });
      if (res.ok) {
        setShowAdd(false);
        setForm({ name: '', sets: '3', reps: '10', weightKg: '0', notes: '' });
        fetchDetail();
      }
    } catch { } finally { setSubmitting(false); }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!session?.accessToken) return;
    setDeletingId(id);
    try {
      await fetch(`${API}/api/personal/norte-training/exercises/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setDetail((p) => p ? { ...p, exercises: p.exercises.filter((e) => e.id !== id) } : p);
    } catch { } finally { setDeletingId(null); }
  };

  const totalVolume = detail?.exercises.reduce((s, e) => s + (e.sets * e.reps * e.weightKg), 0) ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center py-20">
        <span className="text-sm text-white/30">Sessão não encontrada.</span>
        <Link href="/training" className="block mt-4 text-emerald-400 text-sm hover:underline">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/training" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-emerald-400 transition-colors mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao histórico
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            {detail.name} <Dumbbell className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-white/40 mt-1">{new Date(detail.createdAt).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="flex items-center gap-3">
          {!detail.completedAt && (
            <button onClick={handleComplete} disabled={completing}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-semibold text-sm rounded-xl transition-all">
              {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Concluir Treino
            </button>
          )}
          {detail.completedAt && (
            <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-xl">
              ✓ Concluído
            </span>
          )}
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all">
            <Plus className="w-4 h-4" /> Exercício
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Exercícios', value: detail.exercises.length },
          { label: 'Séries Totais', value: detail.exercises.reduce((s, e) => s + e.sets, 0) },
          { label: 'Volume (kg)', value: Math.round(totalVolume) }
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center backdrop-blur-md">
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-1">{kpi.label}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Exercícios</h2>
        {detail.exercises.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl">
            <Dumbbell className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <span className="text-sm text-white/30">Adicione o primeiro exercício desta sessão.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {detail.exercises.map((ex, i) => (
                <motion.div key={ex.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-400">{i + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-white/90 block truncate">{ex.name}</span>
                      {ex.notes && <span className="text-xs text-white/30 block truncate">{ex.notes}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="flex items-center gap-3 text-center">
                      <div>
                        <span className="text-[10px] text-white/30 uppercase block">Séries</span>
                        <span className="text-sm font-bold font-mono text-white">{ex.sets}</span>
                      </div>
                      <span className="text-white/15">×</span>
                      <div>
                        <span className="text-[10px] text-white/30 uppercase block">Reps</span>
                        <span className="text-sm font-bold font-mono text-white">{ex.reps}</span>
                      </div>
                      <span className="text-white/15">@</span>
                      <div>
                        <span className="text-[10px] text-white/30 uppercase block">Carga</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">{ex.weightKg}kg</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteExercise(ex.id)} disabled={deletingId === ex.id}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      {deletingId === ex.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddExercise}
              className="bg-black/95 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Adicionar Exercício</h3>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Nome</label>
                <input type="text" required placeholder="Ex: Supino Reto"
                  value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {([['sets', 'Séries'], ['reps', 'Reps'], ['weightKg', 'Carga (kg)']] as const).map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">{label}</label>
                    <input type="number" min="0" step={key === 'weightKg' ? '0.5' : '1'}
                      value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors text-center" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Notas</label>
                <input type="text" placeholder="Observação opcional..."
                  value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" disabled={submitting || !form.name.trim()}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-lg transition-colors flex items-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Adicionar
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
