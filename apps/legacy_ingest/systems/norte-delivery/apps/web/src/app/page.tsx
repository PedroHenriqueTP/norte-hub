'use client';
import { BentoGrid } from '@/components/BentoGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-norte-graphite text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Static Background */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/cyber-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />

      <header className="relative z-10 text-center mb-8 mt-10">
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-2">Norte Global Hub</h1>
        <p className="text-white/50 text-sm font-mono">Control Center & Ecosystem Router</p>
      </header>

      {/* Smart Search Bar */}
      <div className="relative z-10 w-full max-w-xl mb-12 px-4">
        <div className="bg-white/5 border border-white/10 rounded-full flex items-center px-6 py-3 focus-within:border-white/30 transition-all">
          <svg className="w-5 h-5 text-white/30 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Pesquisar placa, paciente, produto..." 
            className="bg-transparent text-white focus:outline-none w-full text-sm"
          />
          <span className="text-[10px] font-mono opacity-30 ml-2 border border-white/20 px-1.5 rounded">⌘K</span>
        </div>
      </div>

      <BentoGrid />

      {/* Footer / Dock */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 glass-card border-t border-white/5 flex items-center justify-between px-10 z-50">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-norte-accent animate-pulse" />
          <span className="text-xs font-mono opacity-70">All Systems Operational</span>
        </div>
        <div className="flex items-center gap-6 text-xs opacity-50">
          <span>v5.0</span>
          <span>Soberania Digital</span>
        </div>
      </footer>
    </main>
  );
}
