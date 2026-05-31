'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Award, Bell, ShieldCheck, Flame, BarChart3, RotateCw, AlertTriangle, MessageSquare, ShoppingBag, Users } from 'lucide-react'

interface AnalyticsData {
  eventoId: string
  metricasGerais: {
    totalLeadsCapturados: number
    taxaConversaoFila: string
    tempoMedioInteracaoSegundos: number
  }
  interessesMaisClicados: {
    claro5G: number
    claroTvPlus: number
    claroNetVirtua: number
  }
  funilGamificacao: {
    iniciaramJogo: number
    atingiramScorePremium: number
    brindesEfetivamenteRetirados: number
  }
  metricasChatbot: {
    totalInteracoesEstimadas: number
    deflectionRate: string
    transbordosSuporte: number
    leadsDirecionadosVendas: number
    conversaoComercialChatbot: string
  }
}

interface GiftItem {
  id: string
  name: string
  pointsCost: number
  stock: number
  eventName: string
}

export default function AnalyticsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [giftsList, setGiftsList] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch telemetry from API
  const fetchTelemetry = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    setError(null)

    try {
      const param = selectedEventId ? `?evento=${selectedEventId}` : ''
      const res = await fetch(`/api/analytics/dashboard${param}`)
      const resVal = await res.json()
      if (resVal.success) {
        setAnalytics(resVal.data)
      } else {
        setError(resVal.error || 'Erro ao processar telemetria.')
      }

      // Fetch events to compile gifts stock list
      const resEv = await fetch('/api/events')
      const resValEv = await resEv.json()
      if (resValEv.success) {
        const compiledGifts: GiftItem[] = []
        resValEv.events.forEach((ev: any) => {
          ev.gifts.forEach((gf: any) => {
            compiledGifts.push({
              ...gf,
              eventName: ev.name
            })
          })
        })
        setGiftsList(compiledGifts)
      }
    } catch (e) {
      console.error(e)
      setError('Erro de conexão ao carregar painel gerencial.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Poll
  useEffect(() => {
    fetchTelemetry()
    const timer = setInterval(() => fetchTelemetry(true), 5000)
    return () => clearInterval(timer)
  }, [selectedEventId])

  return (
    <main className="relative flex min-h-screen flex-col bg-[#07020b] overflow-hidden text-slate-200 font-sans">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#ee1d23]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#7a1b8c]/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="z-10 border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#ee1d23] flex items-center justify-center font-bold text-white text-xs shadow-lg">C</div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">Dashboard de Telemetria e Analytics</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Painel Administrativo da Agência</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Refresh polling status indicator */}
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-slate-400">
            <button
              onClick={() => fetchTelemetry()}
              disabled={refreshing || loading}
              className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-95 transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#ee1d23]' : ''}`} />
            </button>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/20 border border-emerald-500/25 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>

          <Link 
            href="/promotor"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/5"
          >
            Voltar ao Terminal
          </Link>
        </div>
      </header>

      {/* Filter and selector */}
      <div className="px-6 pt-6 flex justify-between items-center z-10 relative flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Filtrar por Evento:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedEventId('')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                selectedEventId === ''
                  ? 'bg-white/5 border-white/20 text-white'
                  : 'border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              Todos (Geral)
            </button>
            <button
              onClick={() => setSelectedEventId('f1-interlagos')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                selectedEventId === 'f1-interlagos'
                  ? 'bg-[#ee1d23]/10 border-[#ee1d23]/30 text-white'
                  : 'border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              Modo F1
            </button>
            <button
              onClick={() => setSelectedEventId('bienal-livro')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                selectedEventId === 'bienal-livro'
                  ? 'bg-purple-950/20 border-purple-500/30 text-white'
                  : 'border-white/5 text-slate-500 hover:text-white'
              }`}
            >
              Modo Bienal
            </button>
          </div>
        </div>
      </div>

      {loading && !analytics ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-500 font-mono text-xs">
          <RotateCw className="w-5 h-5 text-[#ee1d23] animate-spin" />
          <span>Calculando telemetria...</span>
        </div>
      ) : (
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto z-10 relative">
          
          {/* Left Column: KPI counters & Gamification funnel (7 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="glass-panel rounded-2xl border-white/5 p-5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Leads Capturados</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{analytics?.metricasGerais.totalLeadsCapturados}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/25">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel rounded-2xl border-white/5 p-5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Conversão de Fila</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{analytics?.metricasGerais.taxaConversaoFila}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#ee1d23]/10 flex items-center justify-center text-[#ee1d23] border border-[#ee1d23]/25">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel rounded-2xl border-white/5 p-5 flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">Tempo Médio Interação</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{analytics?.metricasGerais.tempoMedioInteracaoSegundos}s</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/25">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Funnel Gamification */}
            <div className="glass-panel rounded-2xl border-white/5 p-6 shadow-lg flex flex-col gap-5">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-mono font-black uppercase text-slate-400">Funil de Gamificação do Estande</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Acompanhe a conversão dos visitantes ao longo das dinâmicas digitais.</p>
              </div>

              {analytics && (
                <div className="space-y-4">
                  {/* Step 1: Checkin */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                      <span className="text-slate-400">1. VISITANTES CADASTRADOS (LEADS)</span>
                      <span className="text-white">{analytics.metricasGerais.totalLeadsCapturados} leads (100%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* Step 2: Played Game */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                      <span className="text-slate-400">2. PARTICIPARAM DE ALGO (SCORE &gt; 0)</span>
                      <span className="text-white">
                        {analytics.funilGamificacao.iniciaramJogo} jogadas ({
                          analytics.metricasGerais.totalLeadsCapturados > 0
                            ? ((analytics.funilGamificacao.iniciaramJogo / analytics.metricasGerais.totalLeadsCapturados) * 100).toFixed(1)
                            : 0
                        }%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ee1d23] rounded-full" style={{ 
                        width: `${
                          analytics.metricasGerais.totalLeadsCapturados > 0 
                            ? (analytics.funilGamificacao.iniciaramJogo / analytics.metricasGerais.totalLeadsCapturados) * 100 
                            : 0
                        }%` 
                      }} />
                    </div>
                  </div>

                  {/* Step 3: Premium Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                      <span className="text-slate-400">3. ALCANÇARAM TIER PREMIUM (SCORE &gt;= 50 PTS)</span>
                      <span className="text-white">
                        {analytics.funilGamificacao.atingiramScorePremium} usuários ({
                          analytics.metricasGerais.totalLeadsCapturados > 0
                            ? ((analytics.funilGamificacao.atingiramScorePremium / analytics.metricasGerais.totalLeadsCapturados) * 100).toFixed(1)
                            : 0
                        }%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ 
                        width: `${
                          analytics.metricasGerais.totalLeadsCapturados > 0 
                            ? (analytics.funilGamificacao.atingiramScorePremium / analytics.metricasGerais.totalLeadsCapturados) * 100 
                            : 0
                        }%` 
                      }} />
                    </div>
                  </div>

                  {/* Step 4: Redemptions */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                      <span className="text-slate-400">4. BRINDES ENTREGUES FISICAMENTE</span>
                      <span className="text-white">
                        {analytics.funilGamificacao.brindesEfetivamenteRetirados} retiradas ({
                          analytics.metricasGerais.totalLeadsCapturados > 0
                            ? ((analytics.funilGamificacao.brindesEfetivamenteRetirados / analytics.metricasGerais.totalLeadsCapturados) * 100).toFixed(1)
                            : 0
                        }%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ 
                        width: `${
                          analytics.metricasGerais.totalLeadsCapturados > 0 
                            ? (analytics.funilGamificacao.brindesEfetivamenteRetirados / analytics.metricasGerais.totalLeadsCapturados) * 100 
                            : 0
                        }%` 
                      }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chatbot metrics card */}
            <div className="glass-panel rounded-2xl border-white/5 p-6 shadow-lg flex flex-col gap-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-mono font-black uppercase text-slate-400">Auditoria do Chatbot Conecta</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Indicadores do assistente virtual de esclarecimento do estande.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wide">Interações Estimadas</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">{analytics?.metricasChatbot.totalInteracoesEstimadas}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wide">Desvio do Suporte</span>
                  <p className="text-lg font-black text-emerald-400 mt-1 font-mono">{analytics?.metricasChatbot.deflectionRate}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wide">Transbordos Staff</span>
                  <p className="text-lg font-black text-white mt-1 font-mono">{analytics?.metricasChatbot.transbordosSuporte}</p>
                </div>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-bold tracking-wide">Conversão de Leads</span>
                  <p className="text-lg font-black text-amber-500 mt-1 font-mono">{analytics?.metricasChatbot.conversaoComercialChatbot}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Real-time stock warnings (5 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl border-white/5 p-5 shadow-lg flex flex-col h-full overflow-hidden min-h-[350px]">
              
              <div className="border-b border-white/5 pb-3 mb-4">
                <h3 className="text-xs font-mono font-black uppercase text-slate-400 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#ee1d23]" />
                  Status de Estoque Crítico
                </h3>
                <p className="text-[9.5px] text-slate-500 mt-0.5">Alerta para reposição imediata de brindes nos balcões.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {giftsList.length === 0 ? (
                  <span className="text-[10px] text-slate-600 italic block text-center mt-10">Nenhum brinde configurado no banco.</span>
                ) : (
                  giftsList.map((gift) => {
                    const isCritical = gift.stock <= 5
                    const isWarning = gift.stock > 5 && gift.stock <= 15
                    
                    return (
                      <div 
                        key={gift.id}
                        className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                          isCritical 
                            ? 'border-red-500/30 bg-red-950/10 shadow-[0_0_12px_rgba(239,68,68,0.05)] animate-pulse' 
                            : isWarning 
                            ? 'border-amber-500/20 bg-amber-950/5' 
                            : 'border-white/5 bg-slate-950/40'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-white font-sans leading-tight">{gift.name}</h4>
                            <span className="text-[8.5px] text-slate-500 font-mono block mt-1 uppercase">{gift.eventName}</span>
                          </div>
                          
                          <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                            isCritical 
                              ? 'bg-red-500 text-slate-950' 
                              : isWarning 
                              ? 'bg-amber-500 text-slate-950' 
                              : 'bg-white/5 text-slate-400'
                          }`}>
                            {gift.stock} u.
                          </span>
                        </div>

                        {/* Visual Indicators */}
                        {isCritical ? (
                          <div className="flex items-center gap-1 text-[8.5px] text-red-500 font-mono font-black uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Repor Imediatamente!
                          </div>
                        ) : isWarning ? (
                          <div className="flex items-center gap-1 text-[8.5px] text-amber-500 font-mono font-black uppercase tracking-wider">
                            <AlertTriangle className="w-3.5 h-3.5" /> Atenção: Estoque Baixo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[8.5px] text-emerald-400 font-mono font-semibold uppercase tracking-wider">
                            ✓ Estoque Saudável
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

            </div>
          </div>

        </div>
      )}
    </main>
  )
}
