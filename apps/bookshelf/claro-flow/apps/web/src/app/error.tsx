'use client'; // Error components must be Client Components

import React, { useEffect } from 'react';
import { ErrorHealer } from '../lib/agents/error_healer';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { BrandButton } from '../components/common/BrandButton';
import { GlassCard } from '../components/common/GlassCard';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our Self-Healing Agent
    ErrorHealer.dispatch(error, error.digest);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050000] flex items-center justify-center p-4 selection:bg-[#ee1d23]/30">
      {/* Background Layer Zero so we don't break immersion entirely */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-[#ee1d23]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-lg w-full">
        <GlassCard padding="large" className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#ee1d23]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(238,29,35,0.4)]">
            <ShieldAlert className="w-8 h-8 text-[#ee1d23]" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Instabilidade Detectada</h2>
          <p className="text-[#8a8f98] text-sm mb-8 leading-relaxed">
            Nossos sistemas identificaram uma falha pontual. O <strong>Agente Self-Healer</strong> já foi acionado e está gerando um patch de correção automaticamente.
          </p>

          <BrandButton 
            variant="primary" 
            fullWidth 
            onClick={() => reset()}
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Restaurar Conexão
          </BrandButton>

          {/* Dev details - in production this would be hidden, but we leave it for local AI tracking */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-8 text-left w-full bg-black/40 border border-white/10 rounded-lg p-4 overflow-x-auto">
              <span className="text-white text-xs font-bold uppercase tracking-wider mb-2 block text-[#ee1d23]">Healer Diagnostic Payload:</span>
              <pre className="text-[10px] text-slate-400 font-mono">
                {error.name}: {error.message}
              </pre>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
