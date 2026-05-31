'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Camera, QrCode, Ticket, CheckCircle2, AlertCircle, Clock, Search, Award, RefreshCw, UserCheck, ShoppingBag, Eye } from 'lucide-react'

interface DetailedEvent {
  id: string
  name: string
  activations: Array<{
    id: string
    name: string
    pointsGiven: number
  }>
  gifts: Array<{
    id: string
    name: string
    pointsCost: number
    stock: number
  }>
}

interface WalletInfo {
  user: {
    id: string
    name: string
    email: string
    qrCodeToken: string
    totalPoints: number
  }
  history: any[]
  redemptions: any[]
  gifts: any[]
}

interface SessionLog {
  timestamp: string
  type: 'PONTOS' | 'RESGATE'
  message: string
}

export default function PromotorPage() {
  // Load configuration from API
  const [events, setEvents] = useState<DetailedEvent[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [loadingConfig, setLoadingConfig] = useState(true)

  // Roles: 'pontos' (Coletor) or 'resgate' (Entregador de brindes)
  const [promoterRole, setPromoterRole] = useState<'pontos' | 'resgate'>('pontos')
  const [selectedActivationId, setSelectedActivationId] = useState<string>('')

  // Scanner & Inputs
  const [playerToken, setPlayerToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Resgate Mode specific state: searched user details
  const [searchedUser, setSearchedUser] = useState<WalletInfo | null>(null)

  // Audit Logs
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([])

  // WebRTC Camera references
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  // Fetch active configuration from API
  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      if (data.success && data.events.length > 0) {
        setEvents(data.events)
        setSelectedEventId(data.events[0].id)
        if (data.events[0].activations.length > 0) {
          setSelectedActivationId(data.events[0].activations[0].id)
        }
      }
    } catch (e) {
      console.error('Error fetching event configs:', e)
    } finally {
      setLoadingConfig(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  // Update default activation when event changes
  useEffect(() => {
    const currentEvent = events.find(e => e.id === selectedEventId)
    if (currentEvent && currentEvent.activations.length > 0) {
      setSelectedActivationId(currentEvent.activations[0].id)
    }
    setSearchedUser(null)
    setPlayerToken('')
    setError(null)
    setSuccess(null)
  }, [selectedEventId, events])

  // Clear states when role changes
  useEffect(() => {
    setPlayerToken('')
    setSearchedUser(null)
    setError(null)
    setSuccess(null)
  }, [promoterRole])

  // Start Camera WebRTC Stream
  useEffect(() => {
    const currentVideo = videoRef.current
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        })
        if (currentVideo) {
          currentVideo.srcObject = stream
          setCameraActive(true)
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable.', err)
        setCameraError(true)
      }
    }
    
    startCamera()

    return () => {
      if (currentVideo && currentVideo.srcObject) {
        const stream = currentVideo.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Handle Token Search (for Resgate mode)
  const handleSearchUser = async (tokenCode: string) => {
    if (!tokenCode.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(null)
    setSearchedUser(null)

    try {
      const cleanToken = tokenCode.trim().toUpperCase()
      const response = await fetch(`/api/user/wallet?token=${cleanToken}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Código do jogador não localizado.')
        setLoading(false)
        return
      }

      setSearchedUser(data.data)
      setPlayerToken(cleanToken)
    } catch (e) {
      console.error(e)
      setError('Erro de conexão ao buscar jogador.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Scan Activation Submit (for Points Collector mode)
  const handleAwardPoints = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanToken = playerToken.trim().toUpperCase()
    if (!cleanToken || !selectedActivationId) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/activations/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeToken: cleanToken,
          activationId: selectedActivationId
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Falha ao registrar pontos.')
        setLoading(false)
        return
      }

      // Success
      const successMsg = `+${data.pointsEarned} pontos para ${data.user.name}! Novo saldo: ${data.totalPoints} pts.`
      setSuccess(successMsg)
      setPlayerToken('')

      // Log to session log
      const newLog: SessionLog = {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'PONTOS',
        message: `Computado +${data.pointsEarned} pts (${data.log.activation?.name || 'Ativação'}) para ${data.user.name}`
      }
      setSessionLogs(prev => [newLog, ...prev])

    } catch (e) {
      console.error(e)
      setError('Erro de conexão ao registrar pontos.')
    } finally {
      setLoading(false)
    }
  }

  // Handle Gift Redemption Submit (for Resgate mode)
  const handleRedeemGift = async (giftId: string, giftName: string) => {
    if (!searchedUser) return
    const tokenCode = searchedUser.user.qrCodeToken

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/redemption/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeToken: tokenCode,
          giftId
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Falha ao registrar resgate.')
        setLoading(false)
        return
      }

      // Success
      setSuccess(`Brinde "${giftName}" resgatado com sucesso para ${searchedUser.user.name}!`)
      
      // Update session logs
      const newLog: SessionLog = {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type: 'RESGATE',
        message: `Resgate do brinde "${giftName}" realizado para ${searchedUser.user.name}`
      }
      setSessionLogs(prev => [newLog, ...prev])

      // Re-fetch user details to update points & redemptions logs
      await handleSearchUser(tokenCode)

    } catch (e) {
      console.error(e)
      setError('Erro de conexão ao realizar resgate.')
    } finally {
      setLoading(false)
    }
  }

  const activeEvent = events.find(e => e.id === selectedEventId)

  if (loadingConfig) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#07020b] text-slate-400 font-mono text-xs gap-3">
        <RefreshCw className="w-5 h-5 text-[#ee1d23] animate-spin" />
        <span>Carregando Configurações do Estande...</span>
      </div>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-[#07020b] overflow-hidden text-slate-200 font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#ee1d23]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#7a1b8c]/8 blur-[130px] pointer-events-none" />

      {/* Header bar */}
      <header className="z-10 border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#ee1d23] flex items-center justify-center font-bold text-white text-xs shadow-[0_0_10px_rgba(238,29,35,0.4)]">C</div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">Terminal do Promotor Claro</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Controle de Pontos e Estoque</p>
          </div>
        </div>

        {/* Configuration selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Estande Atual</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#ee1d23]"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id} className="bg-slate-950 text-white">{ev.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono mt-2 sm:mt-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conectado</span>
            </div>
          </div>
        </div>
      </header>

      {/* Role Mode selector tabs */}
      <div className="px-6 pt-6 flex gap-3 z-10 relative">
        <button
          onClick={() => setPromoterRole('pontos')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
            promoterRole === 'pontos'
              ? 'bg-[#ee1d23]/10 border-[#ee1d23]/30 text-white shadow-[0_0_15px_rgba(238,29,35,0.1)]'
              : 'border-white/5 text-slate-500 hover:text-white'
          }`}
        >
          Coletor de Pontos
        </button>
        <button
          onClick={() => setPromoterRole('resgate')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
            promoterRole === 'resgate'
              ? 'bg-[#ee1d23]/10 border-[#ee1d23]/30 text-white shadow-[0_0_15px_rgba(238,29,35,0.1)]'
              : 'border-white/5 text-slate-500 hover:text-white'
          }`}
        >
          Estação de Retirada
        </button>
      </div>

      {/* Main Grid split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 overflow-hidden z-10 relative">
        
        {/* Left Column: QR scanner, Camera, Manual Input (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6 h-full">
          {/* WebRTC Camera scanner card */}
          <div className="glass-panel rounded-2xl border-white/5 flex flex-col overflow-hidden h-[260px] sm:h-[300px] relative shadow-lg">
            <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase font-mono">
                <Camera className="w-4 h-4 text-[#ee1d23]" />
                Leitor Câmera
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Facing Environment</span>
            </div>

            <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden">
              {cameraActive && !cameraError ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
                  <QrCode className="w-12 h-12 text-slate-600 animate-pulse" />
                  <p className="text-[9px] text-slate-500 max-w-[180px] leading-relaxed">
                    Camera offline. Digite o código de 6 caracteres do crachá do participante abaixo.
                  </p>
                </div>
              )}

              {/* Holographic scanner laser line and target */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-36 h-36 border border-dashed border-[#ee1d23]/40 rounded-xl relative bg-[#ee1d23]/[0.01]">
                  <div className="absolute left-0 right-0 h-[1.5px] bg-[#ee1d23] shadow-[0_0_8px_rgba(238,29,35,1)] animate-bounce" style={{ animationDuration: '3s' }} />
                  <div className="absolute top-[-1px] left-[-1px] w-3 h-3 border-t-2 border-l-2 border-[#ee1d23]" />
                  <div className="absolute top-[-1px] right-[-1px] w-3 h-3 border-t-2 border-r-2 border-[#ee1d23]" />
                  <div className="absolute bottom-[-1px] left-[-1px] w-3 h-3 border-b-2 border-l-2 border-[#ee1d23]" />
                  <div className="absolute bottom-[-1px] right-[-1px] w-3 h-3 border-b-2 border-r-2 border-[#ee1d23]" />
                </div>
              </div>
            </div>
          </div>

          {/* Role: Points Collector Input Form */}
          {promoterRole === 'pontos' && (
            <div className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4 shadow-lg">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-mono font-black uppercase text-slate-400">Atribuição de Pontos</h3>
                <p className="text-[10px] text-slate-500">Selecione a atividade e insira o ID de jogador para pontuar.</p>
              </div>

              {/* Station select */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ativação do Estande</label>
                <select
                  value={selectedActivationId}
                  onChange={(e) => setSelectedActivationId(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#ee1d23]"
                >
                  {activeEvent?.activations.map(act => (
                    <option key={act.id} value={act.id} className="bg-slate-950 text-white">{act.name} (+{act.pointsGiven} pts)</option>
                  ))}
                </select>
              </div>

              {/* Manual input */}
              <form onSubmit={handleAwardPoints} className="flex gap-2">
                <div className="relative flex-1">
                  <Ticket className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={playerToken}
                    onChange={(e) => setPlayerToken(e.target.value)}
                    placeholder="ID JOGADOR (EX: YR4T7S)"
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#ee1d23] uppercase tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !playerToken.trim()}
                  className="px-5 rounded-xl bg-[#ee1d23] hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none text-xs font-black text-white transition-colors uppercase cursor-pointer"
                >
                  {loading ? 'Bipando...' : 'Computar'}
                </button>
              </form>

              {/* Result alerts */}
              {error && (
                <div className="flex gap-2.5 p-3 rounded-lg border border-red-500/20 bg-red-950/20 text-red-300 text-xs items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="flex gap-2.5 p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs items-start">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}
            </div>
          )}

          {/* Role: Resgate Input Form */}
          {promoterRole === 'resgate' && (
            <div className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-4 shadow-lg">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-mono font-black uppercase text-slate-400">Verificar Jogador</h3>
                <p className="text-[10px] text-slate-500">Busque o saldo e histórico do participante.</p>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={playerToken}
                    onChange={(e) => setPlayerToken(e.target.value)}
                    placeholder="ID JOGADOR (EX: YR4T7S)"
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#ee1d23] uppercase tracking-widest"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchUser(playerToken)}
                  disabled={loading || !playerToken.trim()}
                  className="px-5 rounded-xl bg-[#ee1d23] hover:bg-red-700 disabled:opacity-50 text-xs font-black text-white transition-colors uppercase cursor-pointer"
                >
                  Buscar
                </button>
              </div>

              {/* Search results alerts */}
              {error && (
                <div className="flex gap-2.5 p-3 rounded-lg border border-red-500/20 bg-red-950/20 text-red-300 text-xs items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              {success && (
                <div className="flex gap-2.5 p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs items-start">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{success}</div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Column: User details in Resgate OR Session log (7 cols) */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="glass-panel rounded-2xl border-white/5 flex flex-col h-full overflow-hidden shadow-lg min-h-[350px]">
            
            {/* Title Bar */}
            <div className="px-5 py-3.5 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-white flex items-center gap-1.5">
                {promoterRole === 'resgate' && searchedUser ? (
                  <>
                    <Eye className="w-4 h-4 text-[#ee1d23]" />
                    Carteira do Participante
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-[#ee1d23]" />
                    Auditoria Recente da Sessão
                  </>
                )}
              </span>
              <span className="text-[9px] text-slate-500 font-mono font-semibold">Live Monitor</span>
            </div>

            {/* Content Viewport */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              
              {/* Resgate View: Show User Wallet Details */}
              {promoterRole === 'resgate' ? (
                !searchedUser ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2.5 text-slate-500 my-auto">
                    <Search className="w-8 h-8 text-slate-700 animate-pulse" />
                    <span className="text-xs font-bold uppercase font-mono">Aguardando Leitura</span>
                    <p className="text-[10px] text-slate-600 max-w-[240px] leading-relaxed">
                      Escaneie ou digite o ID do jogador ao lado para exibir o saldo e autorizar resgates.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5 animate-slide-up">
                    {/* Visitor Header summary */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-black text-white">{searchedUser.user.name}</h4>
                        <span className="text-[9px] text-[#ee1d23] font-mono font-bold uppercase tracking-wider block mt-1">ID: {searchedUser.user.qrCodeToken}</span>
                        <span className="text-[9px] text-slate-500 font-mono block">{searchedUser.user.email}</span>
                      </div>
                      <div className="flex flex-col items-end leading-none">
                        <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">Saldo Atual</span>
                        <span className="text-3xl font-black text-white mt-1 font-mono">
                          {searchedUser.user.totalPoints} <span className="text-xs text-[#ee1d23] font-black uppercase font-mono">pts</span>
                        </span>
                      </div>
                    </div>

                    {/* Gifts Stock and Action buttons */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[10px] font-mono font-black uppercase text-slate-400 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> Controle de Resgate
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {searchedUser.gifts.map((gift) => {
                          const claimed = searchedUser.redemptions.some(r => r.gift?.name === gift.name)
                          const eligible = searchedUser.user.totalPoints >= gift.pointsCost
                          const outOfStock = gift.stock <= 0

                          return (
                            <div 
                              key={gift.id}
                              className={`p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between gap-3 ${
                                claimed ? 'opacity-50' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-1">
                                <div>
                                  <h5 className="text-xs font-black text-white">{gift.name}</h5>
                                  <span className="text-[9px] text-slate-500 font-mono">Custo: {gift.pointsCost} pts | Estoque: {gift.stock} u.</span>
                                </div>
                              </div>

                              {claimed ? (
                                <div className="text-[9.5px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 py-1.5 justify-center border border-emerald-500/20 bg-emerald-950/10 rounded-lg">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Entregue
                                </div>
                              ) : outOfStock ? (
                                <div className="text-[9.5px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1 py-1.5 justify-center border border-red-500/20 bg-red-950/10 rounded-lg">
                                  Esgotado
                                </div>
                              ) : !eligible ? (
                                <div className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 py-1.5 justify-center border border-white/5 bg-white/5 rounded-lg">
                                  Ineligível (Falta {gift.pointsCost - searchedUser.user.totalPoints} pts)
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRedeemGift(gift.id, gift.name)}
                                  disabled={loading}
                                  className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[10px] font-black text-slate-950 transition-all uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <UserCheck className="w-3.5 h-3.5" /> Autorizar Entrega
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Timeline of points inside user detail */}
                    <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                      <h4 className="text-[10px] font-mono font-black uppercase text-slate-400">Ativações Bipe Histórico</h4>
                      {searchedUser.history.length === 0 ? (
                        <span className="text-[10px] text-slate-600 italic">Nenhuma atividade visitada ainda.</span>
                      ) : (
                        <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                          {searchedUser.history.map(log => (
                            <div key={log.id} className="flex justify-between items-center text-[10px] py-1.5 px-3 border border-white/5 rounded-lg bg-black/20">
                              <span className="text-slate-400 font-bold">{log.activation?.name || 'Scan'}</span>
                              <span className="text-[#ee1d23] font-mono font-black">+{log.pointsEarned} pts</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                /* Auditoria Mode: Show session logs */
                sessionLogs.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-2.5 text-slate-500 my-auto">
                    <Clock className="w-8 h-8 text-slate-700" />
                    <span className="text-xs font-bold uppercase font-mono">Sem atividade nesta sessão</span>
                    <p className="text-[10px] text-slate-600 max-w-[200px] leading-relaxed">
                      As ações que você realizar nesta tela aparecerão listadas em tempo real aqui.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {sessionLogs.map((log, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-3 text-xs animate-slide-up"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${
                            log.type === 'PONTOS' ? 'bg-[#ee1d23] shadow-[0_0_6px_#ee1d23]' : 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                          }`} />
                          <span className="text-slate-300 font-medium leading-relaxed">{log.message}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono font-semibold shrink-0">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

          </div>
        </section>

      </div>
    </main>
  )
}
