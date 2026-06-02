'use client';

import { useMemo, useState } from 'react';
import {
  getChannelLabel,
  getStatusLabel,
  OrderChannel,
  OrderStatus,
  OrderSummary
} from '@/lib/api';
import { formatCurrency, formatMinutes, formatTimeLabel, normalizeStatusClass } from '@/lib/format';

type StatusFilter = OrderStatus | 'ALL';
type ChannelFilter = OrderChannel | 'ALL';

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Aguardando', value: 'PENDING' },
  { label: 'Confirmados', value: 'CONFIRMED' },
  { label: 'Na cozinha', value: 'PREPARING' },
  { label: 'Prontos', value: 'READY' },
  { label: 'Em entrega', value: 'DELIVERING' }
];

const channelOptions: Array<{ label: string; value: ChannelFilter }> = [
  { label: 'Todos os canais', value: 'ALL' },
  { label: 'App próprio', value: 'OWN_APP' },
  { label: 'iFood', value: 'IFOOD' },
  { label: 'Uber Eats', value: 'UBER_EATS' },
  { label: 'WhatsApp', value: 'WHATSAPP' },
  { label: 'Balcão', value: 'POS' }
];

const actionMapping: Record<OrderStatus, string[]> = {
  PENDING: ['Aceitar pedido', 'Enviar para cozinha'],
  CONFIRMED: ['Começar preparo', 'Designar cozinheiro'],
  PREPARING: ['Marcar como pronto', 'Enviar aviso de atraso'],
  READY: ['Liberar entrega', 'Programar expedição'],
  DELIVERING: ['Enviar atualização', 'Checar entregador'],
  COMPLETED: ['Registrar feedback'],
  CANCELED: ['Analisar motivo']
};

const defaultAction = ['Ver detalhes', 'Fazer ligação'];

interface OrderBoardProps {
  orders: OrderSummary[];
}

export default function OrderBoard({ orders }: OrderBoardProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesChannel = channelFilter === 'ALL' || order.channel === channelFilter;
      const searchTarget =
        `${order.table ?? ''} ${order.customer ?? ''} ${order.notes ?? ''}`.toLowerCase();
      const matchesSearch = search ? searchTarget.includes(search.trim().toLowerCase()) : true;
      return matchesStatus && matchesChannel && matchesSearch;
    });
  }, [orders, statusFilter, channelFilter, search]);

  const metrics = useMemo(() => {
    const activeOrders = filteredOrders.filter((order) =>
      ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(order.status)
    );
    const readyOrders = filteredOrders.filter((order) =>
      ['READY', 'DELIVERING'].includes(order.status)
    );
    const completedOrders = filteredOrders.filter((order) => order.status === 'COMPLETED');
    const totalValue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
    const activeValue = activeOrders.reduce((acc, order) => acc + order.total, 0);
    return {
      total: filteredOrders.length,
      active: activeOrders.length,
      ready: readyOrders.length,
      completed: completedOrders.length,
      totalValue,
      activeValue
    };
  }, [filteredOrders]);

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-bold text-main">Painel de Pedidos</h2>
          <p className="text-muted text-sm mt-1">
            Recebimento rápido, controle de status e ações imediatas.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-ghost border border-border">Atualizar</button>
          <button type="button" className="btn btn-primary">Novas integrações</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <article className="p-4 bg-surface-subtle rounded-xl border border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Pedidos visíveis</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-main">{metrics.total}</span>
            <span className="text-sm text-green-700 font-medium bg-green-100 px-2 py-0.5 rounded-full">
              {metrics.active} Ativos
            </span>
          </div>
        </article>
        <article className="p-4 bg-surface-subtle rounded-xl border border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Prontos / Em rota</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-main">{metrics.ready}</span>
            <span className="text-sm text-blue-700 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
              Em andamento
            </span>
          </div>
        </article>
        <article className="p-4 bg-surface-subtle rounded-xl border border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">Total em caixa</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-main">{formatCurrency(metrics.totalValue)}</span>
            <span className="text-sm text-muted">/{formatCurrency(metrics.activeValue)} ativos</span>
          </div>
        </article>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-surface z-10 py-2">
        <select
          className="input md:w-48"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className="input md:w-48"
          value={channelFilter}
          onChange={(event) => setChannelFilter(event.target.value as ChannelFilter)}
        >
          {channelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          className="input flex-1"
          placeholder="Buscar por mesa, cliente ou observação..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted bg-surface-subtle rounded-xl border border-dashed border-border">
            <p className="text-lg font-medium">Nenhum pedido encontrado</p>
            <p className="text-sm">Tente mudar os filtros ou aguarde novos pedidos.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <article key={order.id} className="p-4 rounded-xl border border-border hover:border-primary transition-colors bg-white shadow-sm flex flex-col md:flex-row gap-4">

              {/* Header Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-bold bg-surface-strong px-2 py-1 rounded">
                    #{order.incrementalId ?? order.id.slice(0, 5)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${normalizeStatusClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-sm text-muted flex items-center gap-1">
                    🕒 {formatTimeLabel(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{order.customer ?? 'Cliente não identificado'}</span>
                  {order.table && (
                    <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                      Mesa {order.table}
                    </span>
                  )}
                </div>

                <div className="text-sm text-muted">
                  {order.items} itens • <span className="font-bold text-main">{formatCurrency(order.total)}</span>
                </div>

                {order.notes && (
                  <p className="text-sm text-orange-700 bg-orange-50 p-2 rounded mt-2 border border-orange-100 inline-block">
                    📝 {order.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[160px]">
                {(actionMapping[order.status] ?? defaultAction).map((action, idx) => (
                  <button
                    key={action}
                    type="button"
                    className={`btn w-full ${idx === 0 ? 'btn-accent' : 'btn-ghost border border-border'}`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

