'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Tv, Clock, RefreshCw, AlertCircle, Sparkles, Heart } from 'lucide-react'

interface InstagramPost {
  id: string
  eventId: string
  username: string
  photoIdx: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  likes: number
}

export default function ModeracaoPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')

  // Fetch all posts from API
  const fetchPosts = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const response = await fetch('/api/instagram/posts')
      const resVal = await response.json()
      if (resVal.success) {
        setPosts(resVal.posts)
      } else {
        setError(resVal.error || 'Erro ao carregar publicações.')
      }
    } catch (e) {
      console.error(e)
      setError('Erro de conexão ao buscar publicações.')
    } finally {
      setLoading(false)
    }
  }

  // Poll for new posts
  useEffect(() => {
    fetchPosts()
    const timer = setInterval(() => fetchPosts(true), 4000)
    return () => clearInterval(timer)
  }, [])

  const handleModerate = async (postId: string, status: 'approved' | 'rejected') => {
    setActioningId(postId)
    try {
      const response = await fetch('/api/instagram/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, status })
      })
      const resVal = await response.json()
      if (resVal.success) {
        // Optimistic UI state update
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p))
      } else {
        alert(`Erro na moderação: ${resVal.error}`)
      }
    } catch (e) {
      console.error(e)
      alert('Erro de conexão ao moderar post.')
    } finally {
      setActioningId(null)
    }
  }

  const getPhotoDetails = (eventId: string, photoIdx: number) => {
    const isF1 = eventId === 'f1-interlagos'
    const mockPhotos = isF1 
      ? [
          { title: 'Painel de Led Sol F1', emoji: '☀️', gradient: 'from-red-600 via-amber-500 to-red-950' },
          { title: 'Cockpit Simulador 5G', emoji: '🏎️', gradient: 'from-slate-900 via-red-600 to-zinc-900' },
          { title: 'Pódio de Interlagos', emoji: '🏆', gradient: 'from-amber-400 via-rose-600 to-purple-900' }
        ]
      : [
          { title: 'Moldura Gigante Literária', emoji: '☀️', gradient: 'from-red-600 via-amber-500 to-red-950' },
          { title: 'Espaço TikToker Pop-out', emoji: '🏎️', gradient: 'from-slate-900 via-red-600 to-zinc-900' },
          { title: 'Arena Cultural Claro tv+', emoji: '🏆', gradient: 'from-amber-400 via-rose-600 to-purple-900' }
        ]
    return mockPhotos[photoIdx] || { title: 'Foto Estande', emoji: '📸', gradient: 'from-zinc-800 to-slate-950' }
  }

  // Filter posts
  const filteredPosts = posts.filter(p => p.status === activeTab)

  return (
    <main className="relative flex min-h-screen flex-col bg-[#07020b] overflow-hidden text-slate-200 font-sans">
      {/* Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#ee1d23]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#7a1b8c]/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="z-10 border-b border-white/5 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#ee1d23] flex items-center justify-center font-bold text-white text-xs shadow-lg">C</div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider">Moderação Concurso Claro</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider font-mono">Moderação de Mídia e Aprovação do Telão</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/telao" 
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)] active:scale-95 cursor-pointer"
          >
            <Tv className="w-4 h-4 fill-current" />
            Abrir Telão LED
          </Link>
          
          <Link 
            href="/promotor"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/5"
          >
            Terminal Promotor
          </Link>
        </div>
      </header>

      {/* Selector Tabs */}
      <div className="px-6 pt-6 flex justify-between items-center z-10 relative">
        <div className="flex gap-3">
          {(['pending', 'approved', 'rejected'] as const).map(tab => {
            const count = posts.filter(p => p.status === tab).length
            const labels = { pending: 'Pendentes', approved: 'Aprovados', rejected: 'Recusados' }
            const colors = { 
              pending: 'text-amber-500 border-amber-500/20 bg-amber-500/5', 
              approved: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', 
              rejected: 'text-rose-500 border-rose-500/20 bg-rose-500/5' 
            }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === tab 
                    ? colors[tab] + ' ring-1 ring-current/25 shadow-md'
                    : 'border-white/5 text-slate-500 hover:text-white'
                }`}
              >
                {labels[tab]} ({count})
              </button>
            )
          })}
        </div>

        <button 
          onClick={() => fetchPosts()}
          disabled={loading}
          className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Submissions view list */}
      <div className="flex-1 p-6 z-10 relative overflow-y-auto">
        {error && (
          <div className="max-w-md mx-auto p-4 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 text-xs flex gap-2.5 items-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="max-w-md mx-auto py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
            <Clock className="w-10 h-10 text-slate-700 animate-pulse" />
            <span className="text-xs font-bold uppercase font-mono tracking-wider">Nenhum post {activeTab === 'pending' ? 'Pendente' : activeTab === 'approved' ? 'Aprovado' : 'Recusado'}</span>
            <p className="text-[10px] text-slate-600 leading-relaxed max-w-xs">
              Quando os visitantes postarem fotos nos corners instagramáveis do estande Claro, elas aparecerão aqui para validação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosts.map(post => {
              const photo = getPhotoDetails(post.eventId, post.photoIdx)
              const isF1 = post.eventId === 'f1-interlagos'

              return (
                <div 
                  key={post.id}
                  className="glass-panel border-white/5 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-lg hover:border-white/10 transition-all relative overflow-hidden"
                >
                  {/* Photo Header */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest">{post.id}</span>
                      <h4 className="text-xs font-black text-white font-sans mt-0.5">{post.username}</h4>
                    </div>
                    <span className="text-[8.5px] text-slate-500 font-mono">
                      {isF1 ? 'GP F1' : 'Bienal'}
                    </span>
                  </div>

                  {/* Photo Simulator Card */}
                  <div className={`h-36 rounded-xl bg-gradient-to-br ${photo.gradient} border border-white/5 relative flex items-center justify-center text-4xl shadow-inner overflow-hidden`}>
                    <div className="absolute inset-0 mesh-network opacity-10" />
                    <span className="relative z-10">{photo.emoji}</span>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono text-[#ee1d23] font-bold flex items-center gap-1 border border-white/10">
                      <Heart className="w-2.5 h-2.5 fill-current" /> {post.likes}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-[#ee1d23] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" /> {photo.title}
                    </span>
                    <p className="text-[9.5px] text-slate-400 font-sans leading-relaxed">
                      Postado usando as hashtags oficiais e o Sol de LED no estande físico Claro.
                    </p>
                  </div>

                  {/* Moderation control actions */}
                  {post.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModerate(post.id, 'approved')}
                        disabled={actioningId === post.id}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-[10px] font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Aprovar
                      </button>
                      <button
                        onClick={() => handleModerate(post.id, 'rejected')}
                        disabled={actioningId === post.id}
                        className="px-3 py-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 disabled:opacity-50 text-rose-400 text-[10px] font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : post.status === 'approved' ? (
                    <button
                      onClick={() => handleModerate(post.id, 'rejected')}
                      disabled={actioningId === post.id}
                      className="w-full py-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Remover do Telão
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(post.id, 'approved')}
                      disabled={actioningId === post.id}
                      className="w-full py-2 bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Re-Aprovar
                    </button>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
