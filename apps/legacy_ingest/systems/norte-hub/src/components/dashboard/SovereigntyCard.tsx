'use client';

import { useEffect, useState } from 'react';

export default function SovereigntyCard() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    // Busca os dados do endpoint de telemetria
    fetch('http://localhost:3333/status/vault')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="border border-emerald-500/30 bg-black p-6 rounded-lg shadow-lg shadow-emerald-500/10 hover:border-orange-500 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Soberania Digital</h2>
        <span className={`text-xs px-2 py-1 rounded ${status?.status === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {status?.status || 'OFFLINE'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Arquivos Criptografados:</span>
          <span className="text-white font-mono">{status?.sovereignty?.total_encrypted_files || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Status do Cofre:</span>
          <span className="text-emerald-400 font-mono">{status?.sovereignty?.storage_status || 'UNKNOWN'}</span>
        </div>
      </div>
      
      <div className="mt-6 text-[10px] text-orange-400 font-mono">
        [SYSTEM]: Monitorando ativos em tempo real...
      </div>
    </div>
  );
}
