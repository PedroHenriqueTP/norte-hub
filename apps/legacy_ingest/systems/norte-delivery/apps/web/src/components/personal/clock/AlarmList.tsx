'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Plus, X, Loader2, Trash2 } from 'lucide-react';

interface Alarm {
  id: string;
  title: string;
  time: string;
  days: string;
  isActive: boolean;
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface AlarmListProps {
  alarms: Alarm[];
  onUpdate: () => void;
}

export function AlarmList({ alarms, onUpdate }: AlarmListProps) {
  const { data: session } = useSession();
  const [showAdd, setShowAdd] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', time: '', days: [] as string[], soundUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const toggleDay = (day: string) => {
    setForm((p) => ({
      ...p,
      days: p.days.includes(day) ? p.days.filter((d) => d !== day) : [...p.days, day]
    }));
  };

  const handleToggle = async (alarm: Alarm) => {
    if (!session?.accessToken) return;
    setToggling(alarm.id);
    try {
      await fetch(`${API}/api/personal/norte-clock/alarms/${alarm.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ isActive: !alarm.isActive })
      });
      onUpdate();
    } catch { } finally { setToggling(null); }
  };

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    setDeleting(id);
    try {
      await fetch(`${API}/api/personal/norte-clock/alarms/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      onUpdate();
    } catch { } finally { setDeleting(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken || !form.title || !form.time || form.days.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/personal/norte-clock/alarms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ title: form.title, time: form.time, days: form.days.join(','), soundUrl: form.soundUrl || undefined })
      });
      if (res.ok) {
        setShowAdd(false);
        setForm({ title: '', time: '', days: [], soundUrl: '' });
        onUpdate();
      }
    } catch { } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          Alarmes de Rotina
        </h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold text-white/60 hover:text-white transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white/50 uppercase">Novo Alarme</span>
                <button type="button" onClick={() => setShowAdd(false)} className="text-white/20 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Ex: Meditação matinal"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <div className="flex gap-1.5 flex-wrap">
                {DAY_LABELS.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(String(i))}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      form.days.includes(String(i))
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border border-white/10 text-white/30 hover:text-white/60'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={submitting || !form.title || !form.time || form.days.length === 0}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Criar Alarme
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {alarms.length === 0 ? (
        <div className="text-center py-10 bg-white/[0.01] border border-white/5 rounded-2xl">
          <BellOff className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <span className="text-sm text-white/30">Nenhum alarme configurado.</span>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {alarms.map((alarm) => {
              const activeDays = alarm.days.split(',').filter(Boolean);
              return (
                <motion.div
                  key={alarm.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    alarm.isActive
                      ? 'border-white/10 bg-white/[0.02]'
                      : 'border-white/5 bg-white/[0.01] opacity-50'
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-white/90 truncate">{alarm.title}</span>
                      <span className="text-sm font-mono font-bold text-emerald-400 shrink-0">{alarm.time}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {DAY_LABELS.map((day, i) => (
                        <span
                          key={day}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            activeDays.includes(String(i))
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'text-white/15'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(alarm)}
                      disabled={toggling === alarm.id}
                      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
                        alarm.isActive ? 'bg-emerald-500' : 'bg-white/10'
                      }`}
                    >
                      {toggling === alarm.id ? (
                        <Loader2 className="w-3 h-3 animate-spin absolute top-1 left-3.5 text-white" />
                      ) : (
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
                          alarm.isActive ? 'left-5' : 'left-0.5'
                        }`} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(alarm.id)}
                      disabled={deleting === alarm.id}
                      className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      {deleting === alarm.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
