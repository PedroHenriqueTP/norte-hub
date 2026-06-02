"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Clock, Check, X, Bell, ChevronRight, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface WaitingItem {
  id: string;
  name: string;
  phone?: string;
  partySize: number;
  status: 'WAITING' | 'CALLED' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
}

export default function WaitingListPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<WaitingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openMode, setOpenMode] = useState<'EXISTING' | 'NEW' | 'GUEST'>('EXISTING');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', partySize: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/waiting-list`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) setItems(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/customers`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) setCustomers(await res.json());
    } catch (error) {
      console.error(error);
    }
  }, [session]);

  useEffect(() => {
    if (isModalOpen) fetchCustomers();
  }, [isModalOpen, fetchCustomers]);

  useEffect(() => {
    fetchItems();
  }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/waiting-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          ...formData,
          name: openMode === 'EXISTING'
            ? (customers.find(c => c.id === selectedCustomerId)?.name || formData.name)
            : formData.name,
          userId: openMode === 'EXISTING' ? selectedCustomerId : undefined
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', phone: '', email: '', partySize: 1 });
        fetchItems();
      } else {
        alert('Erro ao adicionar à fila');
      }
    } catch (error) {
      alert('Erro de conexão');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    if (!confirm(`Alterar status para ${status}?`)) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/waiting-list/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ status })
      });
      if (status === 'COMPLETED' || status === 'CANCELED') {
        setItems(prev => prev.filter(i => i.id !== id));
      } else {
        fetchItems();
      }
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getWaitTime = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    return `${mins} min`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-main">Fila de Espera</h1>
          <p className="text-text-muted">Gerencie a entrada de clientes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Plus size={20} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100">
            <Clock size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Fila vazia no momento.</p>
          </div>
        )}

        {items.map((item) => (
          <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all ${item.status === 'CALLED' ? 'border-l-8 border-l-amber-400' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                {item.phone && <p className="text-sm text-gray-500">{item.phone}</p>}
              </div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Users size={14} /> {item.partySize}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Clock size={16} />
              <span>Chegou às {formatTime(item.createdAt)}</span>
              <span className="text-primary font-bold">({getWaitTime(item.createdAt)})</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {item.status === 'WAITING' ? (
                <button
                  onClick={() => handleStatus(item.id, 'CALLED')}
                  className="col-span-1 bg-amber-50 text-amber-600 hover:bg-amber-100 p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
                >
                  <Bell size={18} /> Chamar
                </button>
              ) : (
                <div className="col-span-1 bg-amber-100 text-amber-700 p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold">
                  <Bell size={18} /> Chamado
                </div>
              )}

              <button
                onClick={() => handleStatus(item.id, 'COMPLETED')}
                className="col-span-1 bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
              >
                <Check size={18} /> Sentar
              </button>

              <button
                onClick={() => handleStatus(item.id, 'CANCELED')}
                className="col-span-1 bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors"
              >
                <X size={18} /> Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Adicionar à Fila</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setOpenMode('EXISTING')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${openMode === 'EXISTING' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cliente Cadastrado
                </button>
                <button
                  type="button"
                  onClick={() => setOpenMode('NEW')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${openMode === 'NEW' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Novo Cadastro
                </button>
                <button
                  type="button"
                  onClick={() => setOpenMode('GUEST')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${openMode === 'GUEST' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Avulso
                </button>
              </div>

              {openMode === 'EXISTING' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Cliente</label>
                  <div className="relative">
                    <select
                      autoFocus
                      value={selectedCustomerId}
                      onChange={(e) => {
                        setSelectedCustomerId(e.target.value);
                        const c = customers.find(cus => cus.id === e.target.value);
                        if (c) setFormData({ ...formData, partySize: formData.partySize, phone: c.phone || '', email: c.email || '', name: c.name });
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} {c.phone ? `- ${c.phone}` : ''}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              )}

              {openMode === 'NEW' && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-4">Para cadastrar um novo cliente completo, acesse o módulo de CRM.</p>
                  <a href="/customers" className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg font-bold hover:bg-black text-sm">
                    <Users size={16} /> Ir para Clientes
                  </a>
                </div>
              )}

              {(openMode === 'GUEST' || openMode === 'EXISTING') && (
                <>
                  {openMode === 'GUEST' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Cliente</label>
                      <input
                        required
                        autoFocus
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Ex: João Silva"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Telefone (Opcional)</label>
                      <input
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Ex: 11 99999..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Pessoas</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          required
                          min="1"
                          max="20"
                          value={formData.partySize}
                          onChange={e => setFormData({ ...formData, partySize: Number(e.target.value) })}
                          className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email (Opcional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Ex: cliente@email.com"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (openMode === 'EXISTING' && !selectedCustomerId)}
                  className="flex-1 py-3 bg-primary text-white hover:bg-primary-dark rounded-xl font-bold transition-colors shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Adicionar à Fila'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
