'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Camera, Heart, Zap } from 'lucide-react'

interface InstagramPost {
  id: string
  eventId: string
  username: string
  photoIdx: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  likes: number
}

export default function TelaoPage() {
  const [approvedPosts, setApprovedPosts] = useState<InstagramPost[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch posts from API
  const fetchApprovedPosts = async () => {
    try {
      const response = await fetch('/api/instagram/posts')
      const resVal = await response.json()
      if (resVal.success) {
        const approved = resVal.posts.filter((p: InstagramPost) => p.status === 'approved')
        setApprovedPosts(approved)
      }
    } catch (e) {
      console.error('Error fetching telao approved posts:', e)
    } finally {
      setLoading(false)
    }
  }

  // Poll for posts
  useEffect(() => {
    fetchApprovedPosts()
    const pollTimer = setInterval(fetchApprovedPosts, 3000)
    return () => clearInterval(pollTimer)
  }, [])

  // Rotate index timer
  useEffect(() => {
    if (approvedPosts.length <= 1) return
    const rotationTimer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % approvedPosts.length)
    }, 6000)
    return () => clearInterval(rotationTimer)
  }, [approvedPosts])

  const getPhotoDetails = (eventId: string, photoIdx: number) => {
    const isF1 = eventId === 'f1-interlagos'
    const mockPhotos = isF1 
      ? [
          { title: 'Painel de Led Sol F1', emoji: '☀️', gradient: 'from-red-600 via-amber-500 to-red-950', hashtag: '#ClaroNaF1' },
          { title: 'Cockpit Simulador 5G', emoji: '🏎️', gradient: 'from-slate-900 via-red-600 to-zinc-900', hashtag: '#ClaroNaF1' },
          { title: 'Pódio de Interlagos', emoji: '🏆', gradient: 'from-amber-400 via-rose-600 to-purple-900', hashtag: '#ClaroNaF1' }
        ]
      : [
          { title: 'Moldura Gigante Literária', emoji: '☀️', gradient: 'from-red-600 via-amber-500 to-red-950', hashtag: '#ClaroNaBienal' },
          { title: 'Espaço TikToker Pop-out', emoji: '🏎️', gradient: 'from-slate-900 via-red-600 to-zinc-900', hashtag: '#ClaroNaBienal' },
          { title: 'Arena Cultural Claro tv+', emoji: '🏆', gradient: 'from-amber-400 via-rose-600 to-purple-900', hashtag: '#ClaroNaBienal' }
        ]
    return mockPhotos[photoIdx] || { title: 'Foto Estande', emoji: '📸', gradient: 'from-zinc-800 to-slate-950', hashtag: '#ClaroConecta' }
  }

  const activePost = approvedPosts[currentIdx]
  const photo = activePost ? getPhotoDetails(activePost.eventId, activePost.photoIdx) : null

  return (
    <main className="relative flex min-h-screen flex-col bg-[#050107] items-center justify-center p-6 text-slate-100 font-sans overflow-hidden">
      
      {/* ── Giant glowing Sol LED background effect ── */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[#ee1d23]/15 to-transparent blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute inset-0 pointer-events-none mesh-network opacity-10" />

      {/* ── Floating red/amber particles ── */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-600 rounded-full blur-[2px] animate-float opacity-30" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-amber-500 rounded-full blur-[1px] animate-float opacity-40" style={{ animationDelay: '3s' }} />

      {/* ── Main Display Frame ── */}
      <div className="z-10 w-full max-w-4xl flex flex-col gap-8 items-center text-center">
        
        {/* Header callout */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ee1d23]/10 border border-[#ee1d23]/30 text-xs font-black uppercase tracking-widest text-[#ee1d23] shadow-[0_0_15px_rgba(238,29,35,0.15)]">
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            Telão de Destaques Claro Conecta
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mt-3">
            Sua foto nos telões do estande!
          </h2>
          <p className="text-sm md:text-md text-slate-400 font-medium">
            Poste no Instagram usando <strong className="text-white">#ClaroNaF1</strong> ou <strong className="text-white">#ClaroNaBienal</strong> e apareça aqui!
          </p>
        </div>

        {/* Carousel slide window */}
        <div className="w-full max-w-md aspect-square glass-premium rounded-3xl border-2 border-white/10 p-5 flex flex-col justify-between shadow-[0_0_50px_rgba(238,29,35,0.08)] relative overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:border-red-500/20">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20" />

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs gap-2">
              <span className="w-6 h-6 rounded-full border-2 border-t-[#ee1d23] border-white/10 animate-spin" />
              <span>Conectando ao feed...</span>
            </div>
          ) : !activePost ? (
            /* Standby / Instruction screen */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-6 my-auto animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#ee1d23] flex items-center justify-center text-white shadow-[0_0_30px_rgba(238,29,35,0.5)] animate-pulse">
                <Camera className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Aguardando Fotos</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Tire uma foto nos Sol de LED do estande físico, faça sua publicação marcando a Claro e veja ela brilhar nesta tela!
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#ee1d23] font-black uppercase tracking-widest bg-[#ee1d23]/10 px-3 py-1 rounded border border-[#ee1d23]/20">
                #JuntosConectamos
              </span>
            </div>
          ) : (
            /* Active photo post */
            <div className="flex-grow flex flex-col justify-between gap-4 animate-scale-up" key={activePost.id}>
              {/* User header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ee1d23] to-[#7a1b8c] flex items-center justify-center text-white text-[10px] font-black uppercase shadow-md">
                    C
                  </div>
                  <span className="text-sm font-black text-white font-sans">{activePost.username}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                  Aprovado
                </span>
              </div>

              {/* Photo preview frame */}
              <div className={`flex-1 rounded-2xl bg-gradient-to-br ${photo?.gradient} border-2 border-white/10 relative flex items-center justify-center text-6xl shadow-inner min-h-[180px]`}>
                <div className="absolute inset-0 mesh-network opacity-10" />
                <span className="relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse">{photo?.emoji}</span>
                
                {/* Likes count */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl text-xs font-mono text-[#ee1d23] font-black flex items-center gap-1.5 shadow-md">
                  <Heart className="w-3.5 h-3.5 fill-current" /> {activePost.likes}
                </div>
              </div>

              {/* Card Footer tags */}
              <div className="text-left space-y-1">
                <span className="text-[10px] font-mono text-[#ee1d23] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> {photo?.title}
                </span>
                <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                  Vivenciando a melhor experiência digital no estande oficial Claro! 🌟 <strong className="text-slate-300 font-mono">{photo?.hashtag}</strong> @clarobrasil
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footnotes instructions */}
        <p className="text-[11px] text-slate-600 font-mono uppercase tracking-widest">
          Consulte o regulamento do Concurso com os promotores. Patrocinador Oficial Claro.
        </p>
      </div>

    </main>
  )
}
