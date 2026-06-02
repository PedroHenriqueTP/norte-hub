"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Plus, Search, Mail, Phone, ShoppingBag,
  User, MapPin, Loader2, ArrowRight
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function CustomersPage() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/customers`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) setCustomers(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [session]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phone: '', address: '' });
        fetchCustomers();
      } else {
        alert('Erro ao criar cliente');
      }
    } catch (error) {
      alert('Erro de conexão');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes (CRM)</h1>
          <p className="text-gray-500 mt-1">Gerencie sua base de clientes e histórico.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, email ou telefone..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Contato</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Pedidos</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Data Cadastro</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex justify-center mb-2">
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    </div>
                    <p className="text-gray-400">Carregando clientes...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    Nenhum cliente encontrado com esse filtro.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{customer.name}</p>
                          {customer.address && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {customer.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} className="text-gray-300" /> {customer.email}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={14} className="text-gray-300" /> {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm font-bold">
                        <ShoppingBag size={14} />
                        {customer._count?.orders || 0}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                      {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Novo Cliente</h2>
                <p className="text-gray-500 text-sm">Preencha os dados abaixo.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                    placeholder="Ex: João da Silva"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Endereço (Opcional)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                    placeholder="Rua Exemplo, 123"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:shadow-none"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
