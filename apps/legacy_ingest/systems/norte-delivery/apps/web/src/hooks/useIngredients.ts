import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPrice: number;
  currentStock: number;
  updatedAt: string;
}

export interface IngredientFormData {
  name: string;
  unit: string;
  costPrice?: number;
  currentStock?: number;
  totalQuantity?: number;
  totalCost?: number;
  yield?: number;
  unitCost?: number;
}

export interface StockMovementData {
  ingredientId: string;
  type: 'IN' | 'OUT' | 'LOSS';
  quantity: number;
  cost?: number;
  description?: string;
}

export function useIngredients() {
  const { data: session } = useSession();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIngredients = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/inventory/ingredients`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });

      if (!res.ok) throw new Error('Falha ao carregar ingredientes');
      const data = await res.json();
      const formatted = data.map((i: any) => ({
        ...i,
        costPrice: Number(i.costPrice),
        currentStock: Number(i.currentStock)
      }));
      setIngredients(formatted);
    } catch (err) {
      setError('Erro ao carregar ingredientes');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createIngredient = async (data: IngredientFormData) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/inventory/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao criar ingrediente');
      }
      await fetchIngredients();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const addStockMovement = async (data: StockMovementData) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/inventory/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao registrar movimentação');
      }
      await fetchIngredients();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  return {
    ingredients,
    loading,
    fetchIngredients,
    error,
    createIngredient,
    addStockMovement
  };
}
