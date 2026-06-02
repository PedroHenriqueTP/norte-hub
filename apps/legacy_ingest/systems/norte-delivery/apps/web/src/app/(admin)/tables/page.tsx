"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Clock, DollarSign, ChevronRight, FileText, Plus, X, Search, Check, Trash2, Edit, Loader2, Printer, StickyNote } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { useThermalPrinter } from '@/hooks/useThermalPrinter';
import { TableOrderModal } from '@/components/TableOrderModal';

export default function TablesPage() {
  const { data: session } = useSession();
  const { emitInvoice, isLoading: isInvoiceLoading } = useInvoices();
  const { printReceipt } = useThermalPrinter();

  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOpenTabModalOpen, setIsOpenTabModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeOrderItems, setActiveOrderItems] = useState<any[]>([]);

  const [clientName, setClientName] = useState('');
  const [openMode, setOpenMode] = useState<'EXISTING' | 'NEW' | 'GUEST'>('EXISTING');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const [editingTableId, setEditingTableId] = useState<number | null>(null);
  const [tableName, setTableName] = useState('');
  const [tableCapacity, setTableCapacity] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'PAYMENT' | 'SUCCESS'>('PAYMENT');
  const [invoiceStatus, setInvoiceStatus] = useState<'NONE' | 'SUCCESS' | 'ERROR'>('NONE');

  const fetchTables = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          console.error("API did not return an array", data);
          setTables([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tables', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchCustomers = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/customers`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) {
        setCustomers(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch customers', error);
    }
  }, [session]);

  useEffect(() => {
    if (isOpenTabModalOpen) {
      fetchCustomers();
    }
  }, [isOpenTabModalOpen, fetchCustomers]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleOpenTab = async () => {
    if (!selectedTable || !session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables/${selectedTable.id}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          clientName: openMode === 'EXISTING'
            ? (customers.find(c => c.id === selectedCustomerId)?.name || 'Cliente')
            : (clientName || 'Cliente'),
          userId: openMode === 'EXISTING' ? selectedCustomerId : undefined
        })
      });

      if (!res.ok) throw new Error('Falha ao abrir mesa');

      await fetchTables();
      setIsOpenTabModalOpen(false);
      setClientName('');
      setSelectedTable(null);
    } catch (error) {
      alert('Erro ao abrir mesa.');
    }
  };

  const calculateTotal = (total: number) => total * 1.1;

  const handleCloseTab = async () => {
    if (!selectedTable || !session?.accessToken) return;
    setIsProcessing(true);

    let methodEnum = 'CASH';
    if (paymentMethod === 'Cartão Crédito') methodEnum = 'CREDIT_CARD';
    if (paymentMethod === 'Cartão Débito') methodEnum = 'DEBIT_CARD';
    if (paymentMethod === 'PIX') methodEnum = 'PIX';

    const amount = calculateTotal(selectedTable.total);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables/${selectedTable.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          paymentMethod: methodEnum,
          amount: amount
        })
      });

      if (!res.ok) throw new Error('Falha ao fechar conta');

      setPaymentStep('SUCCESS');
      setIsProcessing(false);
      await fetchTables();

    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      alert(`Erro ao fechar conta.`);
    }
  };

  const handlePrintReceipt = () => {
    if (!selectedTable) return;
    printReceipt({
      storeName: 'Delivery Platform',
      orderId: selectedTable.id.toString(),
      table: selectedTable.name,
      date: new Date(),
      total: calculateTotal(selectedTable.total),
      paymentMethod: paymentMethod,
      items: [
        { name: 'Consumo Mesa', quantity: 1, price: selectedTable.total },
        { name: 'Taxa de Serviço', quantity: 1, price: selectedTable.total * 0.1 }
      ]
    });
  };

  const handleEmitInvoice = async () => {
    try {
      await emitInvoice("demo-order-id-" + Date.now());
      setInvoiceStatus('SUCCESS');
    } catch (e) {
      setInvoiceStatus('ERROR');
    }
  };

  const finishPaymentFlow = () => {
    setIsPaymentModalOpen(false);
    setSelectedTable(null);
    setPaymentMethod('');
    setReceivedAmount('');
    setPaymentStep('PAYMENT');
    setInvoiceStatus('NONE');
  };

  const openTableModal = (table?: any) => {
    if (table) {
      setEditingTableId(table.id);
      setTableName(table.name);
      setTableCapacity(table.capacity.toString());
    } else {
      setEditingTableId(null);
      setTableName('');
      setTableCapacity('');
    }
    setIsTableModalOpen(true);
  };

  const handleSaveTable = async () => {
    if (!tableName || !tableCapacity || !session?.accessToken) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
    const payload = { name: tableName, capacity: parseInt(tableCapacity) };

    try {
      let res;
      if (editingTableId) {
        res = await fetch(`${apiUrl}/api/systems/norte-bar/tables/${editingTableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${apiUrl}/api/systems/norte-bar/tables`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server Error:', res.status, errorText);
        alert(`Erro do servidor (${res.status}): ${errorText}`);
        throw new Error(errorText || 'Falha na requisição');
      }

      await fetchTables();
      setIsTableModalOpen(false);

      setEditingTableId(null);
      setTableName('');
      setTableCapacity('');

    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!session?.accessToken) return;
    if (confirm('Tem certeza que deseja excluir esta mesa?')) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      await fetch(`${apiUrl}/api/systems/norte-bar/tables/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      await fetchTables();
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Livre': return 'bg-gray-100 text-gray-500';
      case 'Ocupada': return 'bg-red-100 text-red-600';
      case 'Pagamento': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main">Gestão de Mesas</h1>
          <p className="text-text-muted">Controle de comandas, pagamentos e organização.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Buscar mesa ou cliente..." />
          </div>
          <button
            onClick={() => openTableModal()}
            className="flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
          >
            <Plus size={18} /> Nova Mesa
          </button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Nenhuma mesa encontrada</h3>
          <p className="text-gray-500 mb-6">Cadastre suas mesas para começar a operar.</p>
          <button
            onClick={() => openTableModal()}
            className="px-6 py-2 bg-main text-white rounded-lg font-bold hover:bg-black transition-colors"
          >
            Criar Primeira Mesa
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Mesa</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Capacidade</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Tempo</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                        {table.id}
                      </div>
                      <div>
                        <span className="font-bold text-main block">{table.name}</span>
                        <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openTableModal(table)} className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                            <Edit size={12} /> Editar
                          </button>
                          <button onClick={() => handleDeleteTable(table.id)} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                            <Trash2 size={12} /> Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} /> {table.capacity} Lugares
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(table.status)}`}>
                      {table.status}
                    </span>
                  </td>
                  <td className="p-5 text-gray-600 font-medium">
                    {table.client || '-'}
                  </td>
                  <td className="p-5 text-gray-500 text-sm">
                    {table.time && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> {table.time}
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-right font-mono font-bold text-main">
                    {table.total > 0 ? `R$ ${Number(table.total).toFixed(2)}` : '-'}
                  </td>
                  <td className="p-5 text-right">
                    {table.status === 'Livre' ? (
                      <button
                        onClick={() => { setSelectedTable(table); setIsOpenTabModalOpen(true); }}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-bold transition-all"
                      >
                        Abrir Mesa
                      </button>
                    ) : (
                      <div className="flex justify-end w-full">
                        <button
                          onClick={() => { setSelectedTable(table); setIsPaymentModalOpen(true); setPaymentMethod('Cartão Crédito'); setPaymentStep('PAYMENT'); }}
                          className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-auto"
                        >
                          <DollarSign size={14} /> Fechar
                        </button>
                        <button
                          onClick={() => { setSelectedTable(table); setActiveOrderItems(table.items || []); setIsOrderModalOpen(true); }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ml-2"
                        >
                          <FileText size={14} /> Pedido
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOrderModalOpen && selectedTable && (
        <TableOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          tableId={selectedTable.id}
          tableName={selectedTable.name}
          orderId={selectedTable.activeOrderId}
          initialItems={activeOrderItems}
          onUpdate={fetchTables}
        />
      )}

      {isTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-main">{editingTableId ? 'Editar Mesa' : 'Nova Mesa'}</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Mesa</label>
                <input
                  autoFocus
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-6 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Ex: Mesa 10 ou Área VIP"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Capacidade (Pessoas)</label>
                <input
                  type="number"
                  value={tableCapacity}
                  onChange={(e) => setTableCapacity(e.target.value)}
                  className="w-full px-6 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="Ex: 4"
                />
              </div>
            </div>

            <button
              onClick={handleSaveTable}
              className="w-full py-4 text-lg bg-main text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {isOpenTabModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-main">Abrir {selectedTable.name}</h3>
              <button onClick={() => setIsOpenTabModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 mb-6">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setOpenMode('EXISTING')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${openMode === 'EXISTING' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cliente
                </button>
                <button
                  onClick={() => setOpenMode('NEW')}
                  className={`flex-1 py-3 text-base font-bold rounded-xl transition-all ${openMode === 'NEW' ? 'bg-white shadow-md text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Cadastrar
                </button>
                <button
                  onClick={() => setOpenMode('GUEST')}
                  className={`flex-1 py-3 text-base font-bold rounded-xl transition-all ${openMode === 'GUEST' ? 'bg-white shadow-md text-main' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Avulso
                </button>
              </div>

              {openMode === 'EXISTING' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Selecione o Cliente</label>
                  <div className="relative">
                    <select
                      autoFocus
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-6 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none appearance-none cursor-pointer"
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
                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-4">Para cadastrar um novo cliente, acesse o módulo de CRM.</p>
                  <a href="/customers" className="inline-flex items-center gap-2 px-4 py-2 bg-main text-white rounded-lg font-bold hover:bg-black text-sm">
                    <Users size={16} /> Ir para Clientes
                  </a>
                </div>
              )}

              {openMode === 'GUEST' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Temporário</label>
                  <input
                    autoFocus
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-6 py-4 text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none"
                    placeholder="Ex: Mesa 10 - João"
                  />
                </div>
              )}

              <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex gap-3">
                <Clock size={20} className="shrink-0" />
                <p>A mesa ficará indisponível para reservas online.</p>
              </div>
            </div>

            <button
              onClick={handleOpenTab}
              disabled={openMode === 'EXISTING' && !selectedCustomerId}
              className="w-full py-4 text-lg bg-primary text-white font-bold rounded-2xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Confirmar Abertura
            </button>
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            <div className="bg-gray-50 p-8 md:w-1/3 flex flex-col justify-between border-r border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-main mb-1">Resumo</h3>
                <p className="text-sm text-gray-500 mb-8">{selectedTable.name} • {selectedTable.client}</p>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-main">R$ {Number(selectedTable.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxa de Serviço (10%)</span>
                    <span className="font-bold text-main">R$ {(Number(selectedTable.total) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-main">Total a Pagar</span>
                    <span className="text-3xl font-black text-main">R$ {calculateTotal(Number(selectedTable.total)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs text-center text-gray-400">ID da Transação: {Date.now().toString().slice(-8)}</p>
              </div>
            </div>

            <div className="p-8 md:w-2/3 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-main">
                  {paymentStep === 'PAYMENT' ? 'Pagamento' : 'Pagamento Realizado!'}
                </h3>
                <button onClick={finishPaymentFlow} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <X size={24} />
                </button>
              </div>

              {paymentStep === 'PAYMENT' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {['Cartão Crédito', 'Cartão Débito', 'PIX', 'Dinheiro'].map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`py-4 px-6 rounded-xl font-bold border-2 transition-all text-left flex flex-col gap-1
                          ${paymentMethod === method ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}
                        `}
                      >
                        <span className="text-sm">Método</span>
                        <span className="text-lg">{method}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Valor Recebido (R$)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                        <input
                          type="number"
                          value={receivedAmount}
                          onChange={(e) => setReceivedAmount(e.target.value)}
                          className="w-full pl-12 pr-32 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold text-main focus:border-green-500 focus:ring-0 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0,00"
                          autoFocus
                        />
                        <button
                          onClick={() => setReceivedAmount(calculateTotal(Number(selectedTable.total)).toFixed(2))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-200 transition-colors"
                        >
                          Valor Exato
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'Dinheiro' && receivedAmount && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                        <span className="font-bold text-yellow-800">Troco a Devolver</span>
                        <span className="text-2xl font-black text-yellow-800">R$ {Math.max(0, parseFloat(receivedAmount.replace(',', '.')) - calculateTotal(Number(selectedTable.total))).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCloseTab}
                    disabled={!receivedAmount || parseFloat(receivedAmount) < calculateTotal(Number(selectedTable.total)) || isProcessing}
                    className={`w-full py-4 mt-6 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all
                      ${(!receivedAmount || parseFloat(receivedAmount) < calculateTotal(Number(selectedTable.total))) ? 'bg-gray-300 cursor-not-allowed' :
                        isProcessing ? 'bg-green-700 cursor-wait' : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'}
                    `}
                  >
                    {isProcessing ? (
                      <span>Processando...</span>
                    ) : (
                      <>
                        <Check size={24} />
                        <span>Confirmar Recebimento</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Check size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-main text-center">Conta da {selectedTable.name} fechada com sucesso!</h3>

                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button
                      onClick={handlePrintReceipt}
                      className="py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 flex flex-col items-center gap-2"
                    >
                      <Printer size={24} />
                      Imprimir Via
                    </button>
                    <button
                      onClick={handleEmitInvoice}
                      disabled={isInvoiceLoading || invoiceStatus === 'SUCCESS'}
                      className={`py-4 font-bold rounded-xl flex flex-col items-center gap-2 border-2 transition-all
                        ${invoiceStatus === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-primary text-primary hover:bg-primary/5'}
                      `}
                    >
                      {isInvoiceLoading ? <Loader2 className="animate-spin" size={24} /> : <StickyNote size={24} />}
                      {invoiceStatus === 'SUCCESS' ? 'Nota Emitida!' : 'Emitir Nota (NFC-e)'}
                    </button>
                  </div>

                  <button
                    onClick={finishPaymentFlow}
                    className="w-full py-3 bg-main text-white font-bold rounded-xl hover:bg-gray-800"
                  >
                    Concluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
