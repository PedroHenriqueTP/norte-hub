"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Package } from 'lucide-react';
import { NewTransactionModal } from './components/new-transaction-modal';

export default function FinancePage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      fetchTransactions();
    }
  }, [session]);

  const fetchTransactions = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/transactions`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (data: any) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        await fetchTransactions();
        setIsModalOpen(false);
      } else {
        alert('Erro ao salvar movimentação');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão');
    }
  };

  const income = transactions.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const expense = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + Number(t.amount), 0);

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main">Financeiro</h1>
          <p className="text-text-muted">Acompanhe seu fluxo de caixa e DRE.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center gap-2 bg-main text-white px-6 py-3 rounded-xl hover:bg-main/90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <DollarSign size={20} />
            Nova Movimentação
          </button>

          <a href="/finance/movements" className="btn btn-secondary flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp size={18} />
            Extrato
          </a>
          <a href="/inventory" className="btn btn-secondary flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Package size={18} />
            Estoque
          </a>
        </div>
      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTransaction}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-2 font-medium">Faturamento Bruto</p>
          <h3 className="text-3xl font-black text-main mb-2">R$ {income.toFixed(2)}</h3>
          <p className="text-xs text-green-600 flex items-center gap-1 font-bold">
            <TrendingUp size={14} /> +0% vs ontem
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-2 font-medium">Ticket Médio</p>
          <h3 className="text-3xl font-black text-main mb-2">R$ {transactions.length > 0 ? (income / transactions.filter(t => t.type === 'INCOME').length).toFixed(2) : '0.00'}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 font-bold">
            --
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-2 font-medium">Saldo Líquido</p>
          <h3 className={`text-3xl font-black mb-2 ${income - expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {(income - expense).toFixed(2)}
          </h3>
          <p className="text-xs text-gray-400 font-medium">Baseado nas transações carregadas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
        <h3 className="font-bold text-lg mb-6">Movimentações Recentes</h3>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 py-10">Nenhuma transação encontrada.</p>
            ) : (
              transactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-main">{t.description || 'Sem descrição'}</p>
                      <p className="text-xs text-gray-500 px-1">
                        {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {t.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
