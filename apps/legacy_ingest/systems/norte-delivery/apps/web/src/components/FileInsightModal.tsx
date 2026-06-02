'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import { CloudFile } from '../hooks/useCloudStorage';

interface FileInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CloudFile;
}

export function FileInsightModal({ isOpen, onClose, file }: FileInsightModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ summary: string; tags: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (file.summary) {
        setInsight({
          summary: file.summary,
          tags: file.tags ? file.tags.split(',') : []
        });
      } else {
        analyzeFile();
      }
    } else {
      setInsight(null);
      setError(null);
    }
  }, [isOpen, file]);

  const analyzeFile = async () => {
    if (!session?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/hub/cortex/analyze-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          fileMetadata: {
            name: file.name,
            mimeType: file.mimeType,
            size: file.size
          },
          fileContent: `Simulated content for ${file.name} context. This document acts as ${file.name} metadata for systems operations.`
        })
      });

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Assinatura ativa do Norte Cloud necessaria para usar esta funcionalidade.');
        }
        throw new Error('Falha ao analisar arquivo.');
      }

      const data = await res.json();
      setInsight(data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/95 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Cortex File Insight</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Arquivo analisado</span>
            <span className="text-sm font-medium text-white/90 truncate block">{file.name}</span>
          </div>

          {loading && (
            <div className="space-y-4 py-8">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-emerald-400 absolute top-3.5 left-3.5 animate-pulse" />
                </div>
                <span className="text-xs text-white/40 animate-pulse">Cortex Neural esta processando os dados...</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-4/6" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-400 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {insight && !loading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block">Resumo do Arquivo</span>
                <p className="text-sm text-white/80 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  {insight.summary}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block">Indexacao de Tags</span>
                <div className="flex flex-wrap gap-2">
                  {insight.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
