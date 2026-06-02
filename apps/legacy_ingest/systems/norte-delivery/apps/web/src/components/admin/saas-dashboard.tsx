"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function SaaSDashboard() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/dashboard/systems`, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Failed to load SaaS metrics", err));
  }, [session]);

  if (!metrics) {
    return <div className="p-8 text-center animate-pulse">Carregando visão orbital...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-main">Visão de Deus (SaaS)</h2>
          <p className="text-muted-foreground">Monitoramento global da plataforma DeliveryPlatform.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
          <Activity size={16} />
          Sistema Operante
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR / MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics.mrr?.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground">Receita Recorrente Mensal</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenants Ativos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeTenants}</div>
            <p className="text-xs text-muted-foreground">+2 na última semana</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Em todos os tenants</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.churnRate}%</div>
            <p className="text-xs text-muted-foreground">Abaixo da média (5%)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Novos Restaurantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentSignups?.map((signup: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {signup.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{signup.name}</p>
                      <p className="text-xs text-muted-foreground">{signup.plan}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">{signup.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
              <AlertCircle size={18} className="mt-0.5" />
              <div>
                <span className="font-bold block">Alta Latência de API</span>
                Detectamos lentidão na região SP-South. A equipe de infra já foi notificada.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
