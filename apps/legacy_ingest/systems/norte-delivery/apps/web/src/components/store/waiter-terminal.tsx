'use client';

import { useMemo, useState } from 'react';
import { fallbackTables } from '@/lib/api';
import { formatCurrency } from '@/lib/format';

const productCatalog = [
  {
    id: 'pizza',
    name: 'Pizza Marguerita',
    description: 'Mussarela, tomate confit e manjericão',
    price: 42.5
  },
  {
    id: 'risoto',
    name: 'Risoto de funghi',
    description: 'Arroz arbóreo com creme de cogumelos frescos',
    price: 58.0
  },
  {
    id: 'lasanha',
    name: 'Lasanha Bolognesa',
    description: 'Molho clássico e bechamel leve',
    price: 48.9
  },
  {
    id: 'drink',
    name: 'Drink da casa',
    description: 'Citrus, gengibre e um toque de cardamomo',
    price: 26.9
  }
];

const channelOptions = [
  { value: 'POS', label: 'Balcão' },
  { value: 'OWN_APP', label: 'App próprio' },
  { value: 'WHATSAPP', label: 'WhatsApp' }
];

interface ItemLine {
  productId: string;
  quantity: number;
  observation: string;
}

export default function WaiterTerminal() {
  const [selectedTable, setSelectedTable] = useState(fallbackTables[0]?.tableNumber ?? '');
  const [channel, setChannel] = useState(channelOptions[0].value);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemLine[]>([
    { productId: productCatalog[0].id, quantity: 1, observation: '' }
  ]);
  const [message, setMessage] = useState('');

  const orderTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = productCatalog.find((entry) => entry.id === item.productId);
      if (!product) {
        return total;
      }
      return total + product.price * item.quantity;
    }, 0);
  }, [items]);

  const tableOptions = fallbackTables.map((table) => ({
    value: table.tableNumber,
    label: `${table.table} (${table.tableNumber})`
  }));

  const handleItemChange = (index: number, field: keyof ItemLine, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { productId: productCatalog[0].id, quantity: 1, observation: '' }
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const table = fallbackTables.find((row) => row.tableNumber === selectedTable);
    setMessage(
      `Pedido para ${table?.table ?? 'balcão'} registrado (${items.length} item${
        items.length === 1 ? '' : 's'
      }).`
    );
  };

  return (
    <section className="mobile-section">
      <div className="panel mobile-panel">
        <div className="panel-header">
          <div>
            <p className="panel-title">Comandas em 1 toque</p>
            <p className="panel-subtitle">Garçom digital para lançar pedidos rápidos.</p>
          </div>
          <div className="overview-actions">
            <button type="button">Scanner</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mobile-form">
          <label className="mobile-label">
            Mesa/comanda
            <select
              className="mobile-select"
              value={selectedTable}
              onChange={(event) => setSelectedTable(event.target.value)}
            >
              {tableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mobile-label">
            Canal
            <select
              className="mobile-select"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
            >
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="mobile-label">
            Cliente
            <input
              className="mobile-input"
              placeholder="Nome, telefone ou comanda"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />
          </label>

          <div className="mobile-items">
            {items.map((item, index) => {
              const product = productCatalog.find((entry) => entry.id === item.productId);
              return (
                <div key={`${item.productId}-${index}`} className="mobile-item-row">
                  <div>
                    <select
                      className="mobile-select mini"
                      value={item.productId}
                      onChange={(event) => handleItemChange(index, 'productId', event.target.value)}
                    >
                      {productCatalog.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name}
                        </option>
                      ))}
                    </select>
                    <small className="mobile-hint">{product?.description}</small>
                  </div>

                  <div>
                    <input
                      type="number"
                      min={1}
                      className="mobile-input mini"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, 'quantity', Number(event.target.value))
                      }
                    />
                    <button
                      type="button"
                      className="mobile-pill danger"
                      onClick={() => removeItem(index)}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="overview-actions mobile-add" onClick={addItem}>
            + Item
          </button>

          <label className="mobile-label">
            Observações
            <textarea
              className="mobile-textarea"
              rows={2}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          <div className="mobile-total">
            <span>Total estimado</span>
            <strong>{formatCurrency(orderTotal)}</strong>
          </div>

          <button type="submit" className="mobile-primary">
            Registrar pedido
          </button>
        </form>

        {message && <p className="mobile-message">{message}</p>}
      </div>
    </section>
  );
}

