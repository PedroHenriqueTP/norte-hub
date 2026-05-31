'use client';

import React from 'react';
import { MessageCircle, X, Send, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../../store/useChatStore';
import { GlassCard } from '../common/GlassCard';

export const ChatbotWidget = () => {
  const { isOpen, toggleChat, activeTip, clearTip } = useChatStore();

  const handleClose = () => {
    toggleChat();
    if (activeTip) clearTip(); // Clear tip when closing
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96"
          >
            <GlassCard padding="none" className="overflow-hidden flex flex-col h-[400px]">
              {/* Header */}
              <div className="bg-[#ee1d23]/10 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ee1d23] flex items-center justify-center shadow-[0_0_10px_rgba(238,29,35,0.5)]">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Claro Concierge</h3>
                    <p className="text-[#8a8f98] text-[10px]">Online agora</p>
                  </div>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-[#8a8f98] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                {activeTip ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#ee1d23]/10 border border-[#ee1d23]/30 rounded-2xl rounded-tr-sm p-4 self-end max-w-[90%]"
                  >
                    <div className="flex items-center gap-2 text-[#ee1d23] mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-wider">Mentor Tip: {activeTip.category}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">{activeTip.title}</h4>
                    <p className="text-white/80 text-xs leading-relaxed">{activeTip.content}</p>
                    <button 
                      onClick={clearTip}
                      className="mt-3 text-[#ee1d23] flex items-center gap-1 text-[10px] font-bold uppercase hover:text-white transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Entendido
                    </button>
                  </motion.div>
                ) : (
                  <div className="bg-black/40 border border-white/10 rounded-2xl rounded-tl-sm p-3 self-start max-w-[85%]">
                    <p className="text-white text-sm">Olá! Bem-vindo à Jornada Digital Claro. Como posso ajudar com sua experiência na Bienal hoje?</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-black/20 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Digite sua dúvida..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 text-sm text-white outline-none focus:border-[#ee1d23]/50 transition-colors"
                />
                <button className="w-10 h-10 rounded-xl bg-[#ee1d23] text-white flex items-center justify-center hover:bg-[#cc181e] transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-[#ee1d23] text-white flex items-center justify-center shadow-[0_0_20px_rgba(238,29,35,0.3)] hover:scale-105 transition-transform relative group"
      >
        <div className="absolute inset-0 rounded-full border border-[#ee1d23] animate-ping opacity-50" />
        
        {/* Mentor Badge */}
        {!isOpen && activeTip && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          </span>
        )}

        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};
