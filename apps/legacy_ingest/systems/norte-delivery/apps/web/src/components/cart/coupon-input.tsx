'use client';

import { useState } from 'react';
import { Tag, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store';
import { toast } from 'sonner';

export function CouponInput() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, discount, applyDiscount, removeDiscount } = useCartStore();

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/systems/norte-bar/coupons/validate?code=${code}&total=${total}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao aplicar cupom');
      }
      applyDiscount({
        code: data.code,
        amount: data.discountAmount
      });
      toast.success(`Cupom ${data.code} aplicado! Desconto: R$ ${data.discountAmount}`);
      setCode('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removeDiscount();
    toast.info('Cupom removido.');
  };

  if (discount) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        <div className="flex items-center gap-2">
          <Tag size={16} />
          <span className="font-medium">
            Cupom <b>{discount.code}</b> aplicado
          </span>
        </div>
        <button onClick={handleRemove} className="text-green-700 hover:text-green-900">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cupom de desconto"
          className="pl-9 w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={loading}
        />
      </div>
      <button
        onClick={handleApply}
        disabled={loading || !code}
        className="h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Aplicar'}
      </button>
    </div>
  );
}
