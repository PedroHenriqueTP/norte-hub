"use client";

import { useSession } from 'next-auth/react';
import { ShoppingBag, Users, ChevronRight, DollarSign, Wallet, ClipboardList, UtensilsCrossed, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { TableOrderModal } from '@/components/TableOrderModal';

function DashboardGreeting({ name }: { name: string }) {
  const phrases = [
    `Olá, ${name}. Como vão as coisas?`,
    `Tudo pronto para cozinhar hoje, ${name}?`,
    `Vamos fazer história hoje, ${name}?`,
    `A cozinha está esperando, ${name}!`,
    `Hora de encantar clientes, ${name}.`
  ];
  const [greeting, setGreeting] = useState(phrases[0]);

  useEffect(() => {
    setGreeting(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  return (
    <h1 className="text-3xl font-bold text-main mb-2">
      {greeting}
    </h1>
  );
}

function StatCard({ title, value, icon: Icon, color, href }: { title: string; value: string; icon: any; color: string; href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-orange-500/10`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="bg-gray-50 rounded-full p-1 group-hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary" />
          </div>
        </div>
        <div>
          <p className="text-sm text-text-muted font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-main group-hover:text-primary transition-colors">{value}</h3>
        </div>
      </div>
    </Link>
  );
}

import { SaaSDashboard } from '@/components/admin/saas-dashboard';

export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Chef';

  if (session?.user?.role === 'SUPER_ADMIN') {
    return (
      <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
        <SaaSDashboard />
      </div>
    );
  }

  const [stats, setStats] = useState({
    delivery: { active: 0 },
    tables: { occupied: 0, total: 0 },
    reservations: { today: 0 },
    finance: { today: 0 },
    recentOrders: [] as any[]
  });

  const [activeTables, setActiveTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const fetchActiveTables = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/systems/norte-bar/tables`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveTables(data.filter((t: any) => t.status === 'Ocupada'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStats = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}/api/systems/norte-bar/dashboard`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchActiveTables();
  }, [session]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <DashboardGreeting name={userName} />
          <p className="text-text-muted">Visão geral da sua operação em tempo real.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-main">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="flex items-center justify-end gap-2 text-green-600 text-sm font-medium mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Loja Aberta
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Delivery"
          value={`${stats.delivery.active} Ativos`}
          icon={ShoppingBag}
          color="bg-orange-500"
          href="/orders"
        />

        <StatCard
          title="Mesas Ocupadas"
          value={`${stats.tables.occupied}/${stats.tables.total}`}
          icon={Users}
          color="bg-blue-500"
          href="/tables"
        />

        <StatCard
          title="Reservas Hoje"
          value={`${stats.reservations.today} Agendados`}
          icon={CalendarClock}
          color="bg-purple-500"
          href="/reservations"
        />

        <StatCard
          title="Faturamento Hoje"
          value={`R$ ${stats.finance.today.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="bg-green-600"
          href="/finance"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-main flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              Últimos Deliveries
            </h3>
            <Link href="/orders" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">ID</div>
              <div className="col-span-4">Cliente</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-2 text-right">Tempo</div>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-400">Nenhum pedido recente.</div>
            ) : (
              stats.recentOrders.map((order, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="col-span-2 font-mono font-bold text-gray-600 group-hover:text-primary transition-colors">{order.id}</div>
                  <div className="col-span-4 font-medium text-main">{order.client}</div>
                  <div className="col-span-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.bg}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-2 font-medium text-gray-600">{order.total}</div>
                  <div className="col-span-2 text-right text-gray-400 text-sm">{order.time}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-main flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                Mesas Ativas
              </h3>
              <Link href="/tables" className="text-xs font-bold text-primary hover:underline">Ver todas</Link>
            </div>

            {activeTables.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhuma mesa ocupada.</p>
            ) : (
              <div className="space-y-3">
                {activeTables.slice(0, 5).map(table => (
                  <div
                    key={table.id}
                    onClick={() => { setSelectedTable(table); setIsOrderModalOpen(true); }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                        {table.id}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{table.name}</p>
                        <p className="text-xs text-gray-500">{table.client || 'Sem cliente'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">R$ {Number(table.total).toFixed(2)}</p>
                      <p className="text-xs text-green-600 group-hover:underline">Ver Pedido</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-main flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-gray-400" />
            Atalhos Rápidos
          </h3>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <Link href="/menu" className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-all group">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-main">Editar Cardápio</p>
                <p className="text-xs text-text-muted">Pausar itens ou mudar preços</p>
              </div>
            </Link>

            <Link href="/finance/cash-register" className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 border border-transparent hover:border-green-100 transition-all group">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-main">Fechar Caixa</p>
                <p className="text-xs text-text-muted">Conferência diária</p>
              </div>
            </Link>

            <Link href="/settings" className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-main">Relatório Gerencial</p>
                <p className="text-xs text-text-muted">Exportar PDF</p>
              </div>
            </Link>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShoppingBag size={100} />
            </div>
            <p className="text-sm text-slate-400 mb-1">Status do Sistema</p>
            <h4 className="text-xl font-bold mb-4">Tudo Operacional</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">iFood</span>
                <span className="text-green-400 font-bold">Conectado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rappi</span>
                <span className="text-green-400 font-bold">Conectado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Impressora</span>
                <span className="text-yellow-400 font-bold">Sem papel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOrderModalOpen && selectedTable && (
        <TableOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          tableId={selectedTable.id}
          tableName={selectedTable.name}
          orderId={selectedTable.activeOrderId}
          initialItems={selectedTable.items || []}
          onUpdate={fetchActiveTables}
        />
      )}
    </div>
  );
}
