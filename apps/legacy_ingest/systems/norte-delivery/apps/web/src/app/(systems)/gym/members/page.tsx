'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Search, Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface Membership {
  id: string;
  studentName: string;
  studentEmail: string;
  price: number;
  status: string;
  endDate: string;
}

export default function MembersPage() {
  const { data: session } = useSession();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ studentName: '', studentEmail: '', price: '', endDate: '' });
  const [submitting, setSubmitting] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

  const fetchMemberships = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/systems/norte-gym/memberships`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) setMemberships(await res.json());
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMemberships(); }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/systems/norte-gym/memberships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) })
      });
      if (res.ok) {
        setShowAddModal(false);
        setForm({ studentName: '', studentEmail: '', price: '', endDate: '' });
        await fetchMemberships();
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = memberships.filter(
    (m) =>
      m.studentName.toLowerCase().includes(search.toLowerCase()) ||
      m.studentEmail.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Matrículas <Users className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-white/60">Gestão de membros e planos de academia</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          Nova Matrícula
        </button>
      </div>

      <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-md">
        <Search className="w-5 h-5 text-white/30 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-white/30 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-white/30">
          <span className="col-span-2">Aluno</span>
          <span>Valor</span>
          <span>Vencimento</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-white/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando matrículas...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <span className="text-sm text-white/30">
              {search ? `Nenhum resultado para "${search}"` : 'Nenhuma matrícula cadastrada.'}
            </span>
          </div>
        ) : (
          filtered.map((m, idx) => (
            <div
              key={m.id}
              className={`grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors ${
                idx !== filtered.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="col-span-2">
                <span className="text-sm font-medium text-white/90 block">{m.studentName}</span>
                <span className="text-xs text-white/30">{m.studentEmail}</span>
              </div>
              <span className="text-sm font-mono font-semibold text-emerald-400">{fmt(m.price)}</span>
              <span className="text-sm text-white/60">{fmtDate(m.endDate)}</span>
              <div>
                {m.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" /> Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" /> {m.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-black/95 border border-white/10 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Nova Matrícula</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-white/30 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {([
              { label: 'Nome do Aluno', key: 'studentName', type: 'text', ph: 'Nome completo' },
              { label: 'E-mail', key: 'studentEmail', type: 'email', ph: 'aluno@email.com' },
              { label: 'Valor (R$)', key: 'price', type: 'number', ph: '150.00' },
              { label: 'Vencimento', key: 'endDate', type: 'date', ph: '' }
            ] as const).map(({ label, key, type, ph }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={ph}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancelar</button>
              <button type="submit" disabled={submitting} className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-lg transition-colors flex items-center gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Matricular
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
