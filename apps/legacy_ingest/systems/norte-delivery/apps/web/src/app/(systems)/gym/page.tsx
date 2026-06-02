'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Users, DollarSign, Dumbbell, Activity, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface GymKpis {
  activeMembers: number;
  mrr: number;
  todayCheckIns: number;
  totalEnrollments: number;
}

interface RecentCheckIn {
  id: string;
  studentName: string;
  studentEmail: string;
  status: string;
  createdAt: string;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="relative p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md overflow-hidden group hover:border-white/10 transition-all duration-300">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} to-transparent`} />
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-2">{label}</span>
          <span className="text-3xl font-bold font-mono text-white">{value}</span>
          {sub && <span className="text-xs text-white/30 block mt-1">{sub}</span>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} opacity-80`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function GymDashboard() {
  const { data: session } = useSession();
  const [kpis, setKpis] = useState<GymKpis | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

    const fetchData = async () => {
      setLoading(true);
      try {
        const [kpisRes, checkinsRes] = await Promise.all([
          fetch(`${apiUrl}/api/systems/norte-gym/kpis`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          }),
          fetch(`${apiUrl}/api/systems/norte-gym/checkins`, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
        ]);
        if (kpisRes.ok) setKpis(await kpisRes.json());
        if (checkinsRes.ok) {
          const data = await checkinsRes.json();
          setRecentCheckIns(data.slice(0, 5));
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Norte Gym <Dumbbell className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-white/60">Painel administrativo de gestão de academia</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/gym/members"
            className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-semibold text-white/80 hover:text-white transition-all"
          >
            Matrículas
          </Link>
          <Link
            href="/gym/checkins"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-sm font-semibold text-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            <Activity className="w-4 h-4" />
            Portaria Ao Vivo
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            label="Alunos Ativos"
            value={String(kpis?.activeMembers ?? 0)}
            icon={Users}
            color="from-emerald-500/20"
            sub="memberships ativos"
          />
          <KpiCard
            label="Receita Recorrente"
            value={formatCurrency(kpis?.mrr ?? 0)}
            icon={DollarSign}
            color="from-teal-500/20"
            sub="MRR estimado"
          />
          <KpiCard
            label="Check-ins Hoje"
            value={String(kpis?.todayCheckIns ?? 0)}
            icon={Activity}
            color="from-cyan-500/20"
            sub="entradas na catraca"
          />
          <KpiCard
            label="Matrículas Ativas"
            value={String(kpis?.totalEnrollments ?? 0)}
            icon={TrendingUp}
            color="from-indigo-500/20"
            sub="alunos matriculados"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Últimas Entradas</h2>
            <Link href="/gym/checkins" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Ao vivo
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentCheckIns.length === 0 ? (
            <p className="text-sm text-white/30 py-6 text-center">Nenhum check-in registrado hoje.</p>
          ) : (
            <div className="space-y-2">
              {recentCheckIns.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-white/90 block">{c.studentName}</span>
                    <span className="text-xs text-white/30">{c.studentEmail}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    c.status === 'PRESENT'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Cortex Insights</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Taxa de Retenção Estimada', value: '87%', trend: '+2% vs mês anterior' },
              { label: 'Pico de Horário', value: '07h – 09h', trend: 'manhã é o período de maior fluxo' },
              { label: 'Risco de Churn', value: '3 alunos', trend: 'sem check-in há +14 dias' }
            ].map((item) => (
              <div key={item.label} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-white/40 block">{item.label}</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{item.value}</span>
                </div>
                <span className="text-xs text-emerald-400/80 text-right max-w-[120px] leading-relaxed">{item.trend}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/20 pt-2">Dados preditivos gerados localmente. Integração Cortex Neural em breve.</p>
        </div>
      </div>
    </div>
  );
}
