'use client';

import { formatCurrency } from '@/lib/format';
import { TableStage, TableStatus } from '@/lib/api';

const statusLabels: Record<TableStage, string> = {
  waiting: 'Aguardando checagem',
  preparation: 'Na cozinha',
  served: 'Servida',
  closing: 'Fechando conta'
};

interface TableBoardProps {
  tables: TableStatus[];
}

export default function TableBoard({ tables }: TableBoardProps) {
  const activeTables = tables.filter((table) => table.status !== 'closing');
  const totalCommands = tables.reduce((acc, table) => acc + table.orders, 0);
  const busiest =
    tables.length > 0
      ? tables.reduce((best, table) => (table.total > best.total ? table : best), tables[0])
      : null;

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-title">Mesas &amp; Comandas</p>
          <p className="panel-subtitle">Controle rápido de mesas abertas, comandas e fechamentos.</p>
        </div>
        <div className="overview-actions">
          <button type="button">Nova comanda</button>
          <button type="button">Encerrar balcão</button>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Mesas ativas</span>
          <span className="metric-value">{activeTables.length}</span>
          <span className="metric-caption">Abertas agora</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">Comandas abertas</span>
          <span className="metric-value">{totalCommands}</span>
          <span className="metric-caption">Somatório diário</span>
        </article>
        <article className="metric-card">
          <span className="metric-label">Mais ocupada</span>
          <span className="metric-value">{busiest?.tableNumber}</span>
          <span className="metric-caption">
            {busiest?.server} • {formatCurrency(busiest?.total ?? 0)}
          </span>
        </article>
      </div>

      <div className="tables-list">
        {tables.map((table) => (
          <article key={table.table} className="table-row">
            <div className="table-info">
              <p className="table-name">
                {table.table} • {table.tableNumber}
              </p>
              <p className="table-meta">
                {table.comandas} • {table.server} • Aberta às {table.openSince}
              </p>
              <p className="table-meta">
                {table.orders} pedido(s) • {formatCurrency(table.total)}
              </p>
            </div>
            <div className="table-actions">
              <span className={`table-pill ${table.status}`}>
                {statusLabels[table.status]}
              </span>
              <span className="table-total">{formatCurrency(table.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

