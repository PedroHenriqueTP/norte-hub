"use client";

import React, { useState } from "react";
import { CreditCard, Wallet, UtensilsCrossed, MonitorDot, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock Data para a interface "Windows POS"
const MOCK_TABLES = [
  { id: 1, number: 1, status: "OCCUPIED", total: 185.50 },
  { id: 2, number: 2, status: "FREE", total: 0 },
  { id: 3, number: 3, status: "OCCUPIED", total: 42.00 },
  { id: 4, number: 4, status: "OCCUPIED", total: 310.90 },
];

const MOCK_WALLET_BALANCE = 50.00; // Saldo de cashback mockado para teste no frontend

export default function GastroPOSPage() {
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [useCashback, setUseCashback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Pagamento Processado com Sucesso via Norte Hub!");
      setSelectedTable(null);
      setUseCashback(false);
      setIsProcessing(false);
    }, 1500);
  };

  const finalAmount = selectedTable 
    ? (useCashback ? Math.max(0, selectedTable.total - MOCK_WALLET_BALANCE) : selectedTable.total) 
    : 0;

  return (
    <div className="p-8 min-h-screen bg-slate-900 text-slate-100 font-sans h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <MonitorDot className="text-orange-500" size={32}/>
          Norte Gastro Engine (PDV)
        </h1>
        <p className="text-slate-400 mt-1">
          Interface de caixa rápido inspirada em janelas fixas. Selecione a mesa para processar o checkout.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[70vh]">
        
        {/* JANELA 1: MAPA DE MESAS (ESQUERDA) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
          <Card className="h-full bg-slate-800 border-slate-700 flex flex-col shadow-2xl">
            <CardHeader className="bg-slate-900 border-b border-slate-700 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-orange-500"/> Mesas Abertas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 grid grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
              {MOCK_TABLES.map(table => (
                <div 
                  key={table.id}
                  onClick={() => table.status === "OCCUPIED" && setSelectedTable(table)}
                  className={`
                    relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer h-32
                    ${table.status === "OCCUPIED" 
                      ? selectedTable?.id === table.id 
                        ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] transform scale-105' 
                        : 'bg-slate-700 border-slate-600 hover:border-orange-500/50'
                      : 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="text-sm font-bold text-slate-400 mb-1">MESA</span>
                  <span className="text-4xl font-black text-white">{table.number}</span>
                  {table.status === "OCCUPIED" && (
                    <div className="mt-2 text-sm font-bold text-orange-400">
                      R$ {table.total.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* JANELA 2: CAIXA / CHECKOUT (DIREITA) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <Card className="h-full bg-slate-800 border-slate-700 flex flex-col shadow-2xl relative overflow-hidden">
            <CardHeader className="bg-slate-900 border-b border-slate-700 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt size={18} className="text-emerald-500"/> Detalhes do Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-between">
              
              {!selectedTable ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <MonitorDot size={48} className="mb-4 opacity-20"/>
                  <p>Selecione uma mesa ativa para fechar a conta.</p>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
                     <div>
                       <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Fechamento</p>
                       <h2 className="text-3xl font-black text-white">Mesa {selectedTable.number}</h2>
                     </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-slate-400">Subtotal Consumo</span>
                      <span className="text-white font-medium">R$ {selectedTable.total.toFixed(2)}</span>
                    </div>

                    {/* Módulo Fintech Acoplado (Integração de Cashback) */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-900/40 to-slate-800 border border-emerald-500/30 relative">
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                             <Wallet size={16} className="text-emerald-400"/>
                             <span className="text-sm font-bold text-emerald-400">Norte Cashback</span>
                          </div>
                          <span className="text-sm font-medium text-emerald-300">Saldo: R$ {MOCK_WALLET_BALANCE.toFixed(2)}</span>
                       </div>
                       
                       <label className="flex items-center gap-3 cursor-pointer mt-4 p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <input 
                            type="checkbox" 
                            checked={useCashback}
                            onChange={(e) => setUseCashback(e.target.checked)}
                            className="w-5 h-5 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                          />
                          <span className="text-sm text-slate-300">Aplicar R$ {Math.min(selectedTable.total, MOCK_WALLET_BALANCE).toFixed(2)} da carteira</span>
                       </label>
                    </div>

                    {useCashback && (
                      <div className="flex justify-between items-center text-lg text-emerald-400">
                        <span>Desconto Cashback</span>
                        <span className="font-bold">- R$ {Math.min(selectedTable.total, MOCK_WALLET_BALANCE).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-700 mt-auto">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-xl text-slate-400 font-bold">Total a Pagar</span>
                      <span className="text-5xl font-black text-white">
                        R$ {finalAmount.toFixed(2)}
                      </span>
                    </div>

                    <Button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full h-14 text-lg font-bold bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                    >
                      {isProcessing ? "Processando..." : (
                        <span className="flex items-center justify-center gap-2">
                          <CreditCard size={20} /> Fechar Conta (Emitir NFC-e)
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
