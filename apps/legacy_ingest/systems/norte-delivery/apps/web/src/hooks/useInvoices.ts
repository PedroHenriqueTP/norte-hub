import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function useInvoices() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emitInvoice = async (orderId: string) => {
    if (!session?.accessToken) return null;
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/finance/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ orderId })
      });
      if (!res.ok) throw new Error('Falha ao emitir nota fiscal');
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    emitInvoice,
    isLoading,
    error
  };
}
