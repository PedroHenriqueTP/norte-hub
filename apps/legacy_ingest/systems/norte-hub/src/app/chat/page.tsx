import { NorteChatbot } from '@/components/intelligence/NorteChatbot';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      {/* Efeito de Fundo Galáctico */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(0,242,255,0.05)_0%,_transparent_50%)]" />
      
      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        <NorteChatbot />
        <div className="flex gap-4">
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:border-cyan-400/50">Lançar Treino</span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:border-cyan-400/50">Status GitHub</span>
          <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-bold uppercase tracking-widest cursor-pointer hover:border-cyan-400/50">Vitals da Nave</span>
        </div>
      </div>
    </main>
  );
}
