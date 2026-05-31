"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Wallet, ChevronRight } from "lucide-react";
import { processMarketplaceCheckout } from "@/actions/marketplace";
import { toast } from "sonner";

export function CheckoutSimbionte({ 
  marketplaceAssetId, 
  resellerId,
  orderItems,
  orderTotal,
  availableCashback 
}: { 
  marketplaceAssetId: string;
  resellerId?: string;
  orderItems: any[];
  orderTotal: number;
  availableCashback: number;
}) {
  const [useCashback, setUseCashback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const discount = useCashback ? Math.min(orderTotal, availableCashback) : 0;
  const finalTotal = orderTotal - discount;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      // Chamada real para a Server Action de Marketplace (Ledger Integration)
      const res = await processMarketplaceCheckout({
        marketplaceAssetId,
        resellerId,
        orderTotal, // Passamos o total da ordem (o split é sobre o valor bruto)
        useCashbackBalance: discount
      });

      if (res.success) {
        toast.success("Pagamento concluído! O Split Simbionte dividiu a receita na nuvem Neon.");
        // Em um app real, redirecionaria para uma página de Sucesso aqui
      }
    } catch (error: any) {
      toast.error(error.message || "Falha na transação.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
      
      {/* Resumo do Pedido */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShoppingCart className="text-violet-500" /> Resumo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-4 mb-6">
            {orderItems.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium">{item.name} <span className="text-slate-500">x{item.quantity}</span></span>
                <span className="font-bold text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center py-4 border-t border-slate-800 text-lg">
            <span className="text-slate-400">Subtotal</span>
            <span className="font-bold">R$ {orderTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Pagamento e Cashback Simbionte */}
      <div className="space-y-6">
        
        {/* Integração de Cashback (Ecossistema Norte) */}
        {availableCashback > 0 && (
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-emerald-500/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Wallet className="text-emerald-400 h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-400">Cashback Norte</h3>
                  <p className="text-xs text-slate-400">Saldo acumulado no ecossistema.</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <span className="font-black text-white text-xl">R$ {availableCashback.toFixed(2)}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-bold text-slate-300">Usar Saldo</span>
                  <input 
                    type="checkbox" 
                    checked={useCashback}
                    onChange={(e) => setUseCashback(e.target.checked)}
                    className="w-5 h-5 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Finalização */}
        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardContent className="p-6">
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>Total Bruto</span>
                <span>R$ {orderTotal.toFixed(2)}</span>
              </div>
              {useCashback && (
                <div className="flex justify-between items-center text-sm text-emerald-400 font-bold">
                  <span>Desconto (Cashback)</span>
                  <span>- R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-4 border-t border-slate-800">
                <span className="text-lg text-slate-300">Total a Pagar</span>
                <span className="text-4xl font-black text-white">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full h-14 bg-violet-600 hover:bg-violet-500 text-white text-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
            >
              {isProcessing ? "Processando Split..." : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={20} /> Fechar Pedido Seguro <ChevronRight size={18}/>
                </span>
              )}
            </Button>
            <p className="text-center text-xs text-slate-500 mt-4">
              Transação criptografada ponta a ponta. Split automático garantido pelo Neon DB.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
