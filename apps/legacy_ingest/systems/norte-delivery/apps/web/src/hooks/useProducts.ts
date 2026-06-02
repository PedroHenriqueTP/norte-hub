import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  categoryId?: string;
  imageUrl?: string;
}

export function useProducts() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (!res.ok) throw new Error('Falha ao carregar produtos');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createProduct = async (data: ProductFormData) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao criar produto');
      }
      await fetchProducts();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const updateProduct = async (id: string, data: ProductFormData) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Falha ao atualizar produto');
      await fetchProducts();
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (!res.ok) throw new Error('Falha ao deletar produto');
      await fetchProducts();
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, fetchProducts, error, createProduct, updateProduct, deleteProduct };
}
