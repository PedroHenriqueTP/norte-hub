"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, Clock, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ProductSelector } from '@/components/ProductSelector';

export default function WaiterTableDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [table, setTable] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addingLoading, setAddingLoading] = useState(false);

  const fetchTable = useCallback(async () => {
    if (!session?.accessToken || !id) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        const tables = await res.json();
        const found = tables.find((t: any) => t.id === Number(id));
        setTable(found);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [session, id]);

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  const handleOpenTable = async () => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables/${id}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ clientName: clientName || 'Cliente' })
      });
      if (!res.ok) throw new Error('Falha');
      fetchTable();
    } catch (e) {
      alert('Erro ao abrir mesa');
    }
  };

  const handleAddItem = async (product: any, quantity: number, observation: string) => {
    if (!table?.activeOrderId || !session?.accessToken) return;
    setAddingLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/orders/${table.activeOrderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          observation
        })
      });
      if (!res.ok) throw new Error('Falha');
      setIsAddingItem(false);
      fetchTable();
    } catch (e) {
      alert('Erro ao adicionar item');
    } finally {
      setAddingLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm('Remover item?')) return;
    if (!table?.activeOrderId || !session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      await fetch(`${apiUrl}/api/systems/norte-bar/orders/${table.activeOrderId}/items/${itemId}/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      fetchTable();
    } catch (e) {
      alert('Erro ao remover item');
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!table) return <div className="p-8 text-center text-gray-500">Mesa não encontrada</div>;

  if (table.status === 'Livre') {
    return (
      <div className="flex flex-col min-h-[80vh]">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/waiter/tables" className="p-2 bg-white rounded-full shadow-sm text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mesa {table.name}</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <Users size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Mesa Disponível</h2>
          <p className="text-gray-500 mb-8 max-w-[200px]">Informe o nome do cliente para iniciar o atendimento.</p>

          <div className="w-full space-y-4">
            <input
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-lg font-medium outline-none focus:border-green-500 focus:bg-white transition-all"
              placeholder="Nome do Cliente (Opcional)"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <button
              onClick={handleOpenTable}
              className="w-full py-4 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all"
            >
              Abrir Mesa
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAddingItem) {
    return (
      <div className="min-h-screen bg-white">
        <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAddingItem(false)} className="p-2 bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold">Adicionar Produtos</h2>
          </div>
        </div>
        <div className="p-4">
          <ProductSelector onSelect={handleAddItem} />
        </div>
        {addingLoading && (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Link href="/waiter/tables" className="p-2 bg-white rounded-full shadow-sm text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{table.name}</h1>
            <p className="text-sm text-gray-500 font-medium">{table.client}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xs text-gray-400">Total</span>
          <span className="block text-xl font-black text-primary">R$ {Number(table.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setIsAddingItem(true)}
          className="p-4 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 flex flex-col items-center gap-2 active:scale-95 transition-all"
        >
          <Plus size={24} />
          <span className="font-bold text-sm">Adicionar</span>
        </button>
        <div className="p-4 bg-white border border-gray-200 rounded-xl flex flex-col items-center gap-2 text-gray-400">
          <Clock size={24} />
          <span className="font-bold text-sm">{table.time}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm">
          Itens do Pedido
        </div>
        <div className="divide-y divide-gray-50">
          {!table.items || table.items.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Nenhum pedido lançado.</div>
          ) : (
            table.items.map((item: any) => (
              <div key={item.id} className="p-4 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{item.product.name}</p>
                    {item.observation && <p className="text-xs text-amber-600 max-w-[150px] truncate">{item.observation}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-600 text-sm">
                    R$ {(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 text-center px-8">
        <p className="text-xs text-gray-400">Para fechar a conta e processar o pagamento, dirija-se ao caixa ou utilize o terminal administrativo.</p>
      </div>
    </div>
  );
}
