'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Activity, Wifi, WifiOff, Plus, X, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface CheckIn {
  id: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
}

function CheckInRow({ checkIn, isNew }: { checkIn: CheckIn; isNew: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const time = new Date(checkIn.createdAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${
        isNew
          ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5'
          : 'border-white/5 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
          checkIn.status === 'PRESENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {checkIn.studentName.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="text-sm font-semibold text-white/90 block">{checkIn.studentName}</span>
          <span className="text-xs text-white/30">{checkIn.studentEmail}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-right">
        <div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            checkIn.status === 'PRESENT'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {checkIn.status}
          </span>
          <span className="text-xs text-white/30 block mt-1 font-mono">{time}</span>
        </div>
        {isNew && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 animate-pulse">
            AO VIVO
          </span>
        )}
      </div>
    </div>
  );
}

export default function CheckInsPage() {
  const { data: session } = useSession();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [form, setForm] = useState({ studentName: '', studentEmail: '', status: 'PRESENT' });
  const [submitting, setSubmitting] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchCheckIns = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/systems/norte-gym/checkins`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCheckIns(data.slice(0, 50));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchCheckIns();

    const socket = io(API, { path: '/ws/gym', transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      setConnected(true);
      const tenantId = (session?.user as any)?.tenantId;
      if (tenantId) socket.emit('joinGymChannel', { tenantId });
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('checkin:new', (newCheckIn: CheckIn) => {
      setCheckIns((prev) => [newCheckIn, ...prev.slice(0, 49)]);
      setNewIds((prev) => {
        const next = new Set(prev);
        next.add(newCheckIn.id);
        return next;
      });
      setTimeout(() => {
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(newCheckIn.id);
          return next;
        });
      }, 8000);
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  }, [session]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/systems/norte-gym/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const created = await res.json();
        setCheckIns((prev) => [created, ...prev.slice(0, 49)]);
        setNewIds((prev) => new Set([...prev, created.id]));
        setTimeout(() => setNewIds((prev) => { const n = new Set(prev); n.delete(created.id); return n; }), 8000);
        setShowRegisterModal(false);
        setForm({ studentName: '', studentEmail: '', status: 'PRESENT' });
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const todayCount = checkIns.filter(
    (c) => new Date(c.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Portaria ao Vivo <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-white/60">Feed em tempo real de entradas na academia</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${
            connected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {connected ? 'Conectado' : 'Offline'}
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            Registrar Entrada
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Entradas Hoje', value: String(todayCount), color: 'text-emerald-400' },
          { label: 'Total no Feed', value: String(checkIns.length), color: 'text-white' },
          { label: 'Status Canal', value: connected ? 'Sync' : 'Aguardando', color: connected ? 'text-emerald-400' : 'text-yellow-400' }
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center backdrop-blur-md">
            <span className="text-xs text-white/30 uppercase tracking-wider block mb-1">{kpi.label}</span>
            <span className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Feed de Entradas
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-white/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando feed...</span>
          </div>
        ) : checkIns.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl">
            <Activity className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <span className="text-sm text-white/30 block">Nenhum check-in registrado.</span>
            <span className="text-xs text-white/15 block mt-1">
              O feed atualizará automaticamente ao vivo quando um aluno entrar.
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {checkIns.map((c) => (
              <CheckInRow key={c.id} checkIn={c} isNew={newIds.has(c.id)} />
            ))}
          </div>
        )}
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRegister} className="bg-black/95 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Registrar Entrada</h3>
              <button type="button" onClick={() => setShowRegisterModal(false)} className="text-white/30 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Nome do Aluno</label>
              <input
                type="text"
                required
                placeholder="Nome completo"
                value={form.studentName}
                onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">E-mail</label>
              <input
                type="email"
                required
                placeholder="aluno@email.com"
                value={form.studentEmail}
                onChange={(e) => setForm((p) => ({ ...p, studentEmail: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="PRESENT">Presente</option>
                <option value="ABSENT">Ausente</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-lg transition-colors flex items-center gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
