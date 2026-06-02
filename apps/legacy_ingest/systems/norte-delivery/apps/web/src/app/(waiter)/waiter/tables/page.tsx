"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Users, Clock, Loader2 } from 'lucide-react';

export default function WaiterTablesPage() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      if (!session?.accessToken) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const res = await fetch(`${apiUrl}/api/systems/norte-bar/tables`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTables(data);
        }
      } catch (error) {
        console.error('Failed to fetch tables', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const filteredTables = tables.filter(t =>
    t.name.toLowerCase().includes(filter.toLowerCase()) ||
    t.client?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
          placeholder="Buscar mesa..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
            {tables.filter(t => t.status === 'Livre').length}
          </div>
          <span className="text-sm font-medium text-gray-600">Livres</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
            {tables.filter(t => t.status !== 'Livre').length}
          </div>
          <span className="text-sm font-medium text-gray-600">Ocupadas</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredTables.map(table => {
          const isOccupied = table.status !== 'Livre';
          return (
            <Link
              key={table.id}
              href={`/waiter/table/${table.id}`}
              className={`p-4 rounded-xl border-2 transition-all active:scale-95 flex flex-col justify-between min-h-[140px]
                ${isOccupied
                  ? 'bg-white border-red-100 shadow-sm relative overflow-hidden'
                  : 'bg-white border-green-100 shadow-sm hover:border-green-300'}
              `}
            >
              {isOccupied && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-500 rounded-bl-full -mr-8 -mt-8 z-0"></div>
              )}

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-2xl font-black text-gray-800">{table.name}</span>
                {isOccupied && <span className="text-white font-bold text-xs bg-red-500 px-2 py-0.5 rounded-full absolute right-[-8px] top-[-8px]">Ocupada</span>}
              </div>

              <div className="relative z-10 space-y-1">
                {isOccupied ? (
                  <>
                    <p className="text-sm font-bold text-main truncate">{table.client || 'Sem nome'}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {table.time}
                      </p>
                      <p className="font-bold text-main">
                        R$ {Number(table.total).toFixed(0)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-green-600 opacity-60 mt-2">
                    <span className="text-sm font-bold">Disponível</span>
                    <Users size={16} className="mt-1" />
                    <span className="text-xs">{table.capacity} lug.</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTables.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          Nenhuma mesa encontrada.
        </div>
      )}
    </div>
  );
}
