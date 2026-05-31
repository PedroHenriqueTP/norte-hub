import { motion } from 'framer-motion';
import { Mic, Send, Bot } from 'lucide-react';

export const NorteChatbot = () => {
  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header com o "Cérebro" */}
      <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-gradient-to-r from-cyan-500/10 to-transparent">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-cyan-400/20 blur-md absolute inset-0"
          />
          <div className="relative z-10 w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-black">
            <Bot className="text-cyan-400 w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-black text-white tracking-tight">Norte <span className="text-cyan-400">AI</span></h2>
          <p className="text-[10px] text-cyan-400/60 font-bold uppercase tracking-widest">Sistemas Vitais: Online</p>
        </div>
      </div>

      {/* Feed de Conversa (Placeholder) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-cyan-400/30 flex items-center justify-center bg-cyan-400/5 text-cyan-400 text-[10px] font-bold">AI</div>
          <div className="max-w-[80%] p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-white/80 leading-relaxed">
            Bem-vindo ao cockpit, Pedrão. O Acer Nitro 5 está operando a 42% de carga. Qual a missão de hoje?
          </div>
        </div>
      </div>

      {/* Input de Comando */}
      <div className="p-6 bg-black/60 border-t border-white/5">
        <div className="flex gap-3">
          <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 transition-all">
            <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Digite um comando neural..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
