import { useState } from 'react';
import { X, Trash2, Plus, ShoppingBag } from 'lucide-react';
import { ProductSelector } from './ProductSelector';
import { useSession } from 'next-auth/react';

interface OrderItem {
  id: string;
  product: { name: string };
  quantity: number;
  price: string | number;
  observation?: string;
}

interface TableOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: number;
  tableName: string;
  orderId?: string;
  initialItems?: OrderItem[];
  onUpdate: () => void;
}

export function TableOrderModal({ isOpen, onClose, tableName, orderId, initialItems = [], onUpdate }: TableOrderModalProps) {
  const { data: session } = useSession();
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddItem = async (product: any, quantity: number, observation: string) => {
    if (!orderId || !session?.accessToken) return;
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/orders/${orderId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          observation
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao adicionar item');
      }

      setIsAddingMode(false);
      onUpdate();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!orderId || !session?.accessToken) return;
    if (!confirm('Remover este item?')) return;

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/orders/${orderId}/items/${itemId}/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });

      if (!res.ok) throw new Error('Falha ao remover item');

      onUpdate();
    } catch (error) {
      alert('Erro ao remover item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-main">Pedido - {tableName}</h2>
            <p className="text-sm text-text-muted">Gerenciar consumo</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isAddingMode ? (
            <button
              onClick={() => setIsAddingMode(true)}
              className="w-full py-3 border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/5 hover:border-primary transition-colors"
            >
              <Plus size={20} /> Adicionar Produto
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Selecionar Produto</h3>
                <button onClick={() => setIsAddingMode(false)} className="text-sm text-gray-500 hover:text-gray-700">Fechar</button>
              </div>
              <ProductSelector onSelect={handleAddItem} />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag size={18} /> Itens do Pedido
            </h3>

            {initialItems.length === 0 ? (
              <div className="text-center p-8 text-gray-400 border border-gray-100 rounded-xl bg-gray-50">
                Nenhum item lançado.
              </div>
            ) : (
              <div className="space-y-2">
                {initialItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg group">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {item.quantity}x
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        {item.observation && <p className="text-xs text-amber-600 italic">{item.observation}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-700">
                        {(Number(item.price) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isLoading}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4 text-lg">
            <span className="font-bold text-gray-600">Total</span>
            <span className="font-black text-main text-2xl">
              {initialItems.reduce((acc, i) => acc + (Number(i.price) * i.quantity), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
