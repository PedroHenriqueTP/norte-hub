import WaiterTerminal from '@/components/store/waiter-terminal';
import { fallbackTables, TableStage } from '@/lib/api';

const statusLabels: Record<TableStage, string> = {
  waiting: 'Aguardando',
  preparation: 'Na cozinha',
  served: 'Servida',
  closing: 'Fechando'
};

export default function GarcomPage() {
  return (
    <main className="mobile-shell">
      <section className="mobile-hero">
        <h2>App do garçom</h2>
        <p>Registre pedidos e comandas do balcão em segundos, em qualquer tela.</p>
      </section>

      <WaiterTerminal />

      <section className="mobile-section">
        <div className="panel mobile-panel">
          <div className="panel-header">
            <div>
              <p className="panel-title">Mesas abertas</p>
              <p className="panel-subtitle">Status e comandas para decidir próxima ação.</p>
            </div>
          </div>

          <div className="table-quick-list">
            {fallbackTables.map((table) => (
              <article key={table.tableNumber} className="table-quick-card">
                <p className="table-quick-title">
                  {table.table} • {table.tableNumber}
                </p>
                <p className="table-quick-meta">{table.comandas}</p>
                <p className="table-quick-meta">
                  {table.orders} pedido(s) • {table.server}
                </p>
                <span className="table-quick-pill">{statusLabels[table.status]}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

