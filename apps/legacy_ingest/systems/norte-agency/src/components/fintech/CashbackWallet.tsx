"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownCircle, CheckCircle } from "lucide-react";
import { redeemCashback } from "@/actions/billing";
import { toast } from "sonner"; // Assumindo que a app já tem a estrutura de toast do Shadcn/Sonner

interface CashbackWalletProps {
  initialBalance: number;
}

export function CashbackWallet({ initialBalance }: CashbackWalletProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = async () => {
    if (balance <= 0) {
      toast.error("Você não tem saldo suficiente para resgate.");
      return;
    }

    try {
      setIsRedeeming(true);
      const res = await redeemCashback();
      if (res.success) {
        setBalance(0);
        toast.success(`R$ ${res.redeemedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} resgatados e aplicados na sua fatura com sucesso!`);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao resgatar cashback.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Card className="h-full glass-card border-l-4 border-l-emerald-500/50 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-500"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-emerald-400">Digital Wallet (Cashback)</CardTitle>
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <Wallet className="h-4 w-4 text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          <div className="text-4xl font-black text-white mt-2">
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Créditos disponíveis para abatimento de fatura ou uso na NorteStore.</p>
        </div>
        
        <Button 
          onClick={handleRedeem}
          disabled={balance <= 0 || isRedeeming}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 disabled:opacity-50 transition-all"
        >
          {isRedeeming ? (
            <span className="flex items-center"><Wallet className="mr-2 h-4 w-4 animate-bounce" /> Processando...</span>
          ) : balance <= 0 ? (
            <span className="flex items-center"><CheckCircle className="mr-2 h-4 w-4" /> Sem Saldo</span>
          ) : (
            <span className="flex items-center"><ArrowDownCircle className="mr-2 h-4 w-4" /> Resgatar para Fatura</span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
