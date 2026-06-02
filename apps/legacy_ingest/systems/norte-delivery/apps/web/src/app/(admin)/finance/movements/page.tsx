"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Plus } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number | string;
  type: 'INCOME' | 'EXPENSE';
  paymentMethod: string;
  createdAt: string;
}

export default function MovementsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paymentMethod: 'CASH',
    type: 'INCOME'
  });

  const fetchTransactions = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/transactions`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const amountValue = parseFloat(formData.amount.replace(',', '.'));
      const finalAmount = formData.type === 'EXPENSE' ? -Math.abs(amountValue) : Math.abs(amountValue);

      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          paymentMethod: formData.paymentMethod,
          description: formData.description
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ description: '', amount: '', paymentMethod: 'CASH', type: 'INCOME' });
        fetchTransactions();
      } else {
        alert('Erro ao salvar movimentação');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar movimentação');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  if (loading && transactions.length === 0) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main">Movimentações</h1>
          <p className="text-text-muted">Histórico de entradas e saídas.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Nova Movimentação
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100 text-left">
            <tr>
              <th className="p-4 text-sm font-bold text-gray-600">Descrição</th>
              <th className="p-4 text-sm font-bold text-gray-600">Data</th>
              <th className="p-4 text-sm font-bold text-gray-600">Método</th>
              <th className="p-4 text-sm font-bold text-gray-600 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{t.description || 'Sem descrição'}</td>
                <td className="p-4 text-gray-500 text-sm">
                  {new Date(t.createdAt).toLocaleString('pt-BR')}
                </td>
                <td className="p-4 text-gray-600 text-sm">{t.paymentMethod}</td>
                <td className={`p-4 font-bold text-right ${(t.type === 'INCOME' || Number(t.amount) > 0) ? 'text-green-600' : 'text-red-500'
                  }`}>
                  {Number(t.amount) > 0 ? '+' : ''}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(t.amount))}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">Nenhuma movimentação registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Nova Movimentação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    className={`py-2 rounded-lg font-bold border ${formData.type === 'INCOME' ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-500'}`}
                  >
                    Entrada (Suprimento)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    className={`py-2 rounded-lg font-bold border ${formData.type === 'EXPENSE' ? 'bg-red-50 border-red-200 text-red-700' : 'border-gray-200 text-gray-500'}`}
                  >
                    Saída (Sangria)
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-main"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-main"
                  placeholder="Ex: Compra de gelo"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-main text-white font-bold rounded-lg hover:bg-main/90"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
