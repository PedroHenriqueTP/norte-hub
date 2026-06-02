"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { CreditCard, Lock, RefreshCw, Smartphone, Banknote } from 'lucide-react';

interface DailyBalance {
  totalIncome: number;
  totalExpense: number;
  finalBalance: number;
  byMethod: {
    CASH: number;
    CREDIT_CARD: number;
    DEBIT_CARD: number;
    PIX: number;
    VOUCHER: number;
  };
}

export default function CashRegisterPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<DailyBalance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/daily-balance`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Erro ao buscar balanço:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return <div className="p-8">Carregando balanço...</div>;
  }

  if (!balance) return <div className="p-8">Erro ao carregar dados.</div>;

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main">Fechamento de Caixa</h1>
          <p className="text-text-muted">Resumo financeiro do dia atual.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBalance}
            className="btn bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw size={18} /> Atualizar
          </button>
          <button className="btn btn-primary bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
            <Lock size={18} /> Fechar Caixa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 mb-1">Total Entradas</p>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(balance.totalIncome)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 mb-1">Total Saídas</p>
          <p className="text-3xl font-bold text-red-500">{formatCurrency(balance.totalExpense)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-500 mb-1">Saldo Final</p>
          <p className={`text-3xl font-bold ${balance.finalBalance >= 0 ? 'text-main' : 'text-red-500'}`}>
            {formatCurrency(balance.finalBalance)}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhamento por Método</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Banknote size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Dinheiro</p>
            <p className="font-bold text-gray-800">{formatCurrency(balance.byMethod.CASH || 0)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Crédito</p>
            <p className="font-bold text-gray-800">{formatCurrency(balance.byMethod.CREDIT_CARD || 0)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Débito</p>
            <p className="font-bold text-gray-800">{formatCurrency(balance.byMethod.DEBIT_CARD || 0)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
            <Smartphone size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Pix</p>
            <p className="font-bold text-gray-800">{formatCurrency(balance.byMethod.PIX || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
