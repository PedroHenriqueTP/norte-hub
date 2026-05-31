'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Building, ChevronRight, Zap, Target } from 'lucide-react'

export default function SpOpenCheckinPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || name.length < 2) {
      setError('Insira seu nome completo.')
      return
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Insira um e-mail corporativo válido.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: 'sp-open',
          name,
          email,
          company
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Falha ao realizar check-in.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/carteira/${data.qrCodeToken}`)
      }, 1000)

    } catch (err) {
      console.error('Check-in error:', err)
      setError('Erro de conexão ao servidor.')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050507] text-slate-100 flex items-center justify-center p-4 overflow-hidden antialiased">
      
      {/* Background Graphic Accent - Emerald Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] bg-emerald-500/10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] bg-emerald-600/10 pointer-events-none" />
      
      {/* Backdrop Image - Tennis Court */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-lighten"
        style={{ backgroundImage: 'url(/sp_open_court_realistic.webp)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507] pointer-events-none" />

      {/* Check-in Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
        
        {/* Glowing border corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-500/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-500/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40 rounded-br-xl" />

        {/* Branding header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
            </div>
            <span className="text-xs font-black tracking-widest text-white uppercase">CLARO</span>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Keep Promoções</span>
        </div>

        {/* Card content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black uppercase text-white tracking-tight">SP Open Tênis</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Realize o seu credenciamento e participe de ativações tecnológicas da Claro 5G para acumular pontos e ganhar prêmios exclusivas.
          </p>
        </div>

        <form onSubmit={handleCheckin} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Nome completo"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              placeholder="E-mail corporativo"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="relative">
            <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Empresa (Opcional)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="w-full h-11 bg-white/5 border border-white/5 rounded-xl pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          {error && (
            <p className="text-[10px] text-emerald-400 font-bold font-mono text-center bg-emerald-950/20 py-1.5 rounded-lg border border-emerald-500/20">{error}</p>
          )}

          {success && (
            <p className="text-[10px] text-emerald-400 font-bold text-center bg-emerald-950/40 py-1.5 rounded-lg border border-emerald-500/30">Credenciamento realizado com sucesso! Redirecionando...</p>
          )}

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-lg shadow-emerald-600/10 active:scale-[0.98]"
          >
            {loading ? 'Processando...' : 'Realizar Check-in'} <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setName('Visitante Tênis')
              setEmail('visitante.open@claro.com.br')
              setCompany('Claro Sports')
            }}
            className="text-[9px] text-emerald-400 hover:underline font-bold font-mono cursor-pointer"
          >
            Preencher com dados de teste
          </button>
        </div>

      </div>
    </div>
  )
}
