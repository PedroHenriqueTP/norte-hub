"use client";

import React, { useState } from "react";
import { Send, Image as ImageIcon, Briefcase, Heart, Cpu } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  id: string;
  sender: "ME" | "OTHER";
  text?: string;
  isCard?: boolean;
  cardData?: any;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "OTHER",
    text: "E aí Pedrão! Vi no Feed que você bateu 1000 commits na arquitetura do SaaS Maker."
  },
  {
    id: "2",
    sender: "ME",
    text: "Fala João! A máquina não para. Conectei o Córtex Neural no banco hoje."
  },
  {
    id: "3",
    sender: "OTHER",
    isCard: true,
    cardData: {
      type: "AFFINITY_MATCH",
      title: "Sugestão do Oráculo",
      reason: "Ambos estudam Ciência de Dados na PUC e frequentam a Bluefit.",
      score: 98
    }
  }
];

export function NorteChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "ME",
      text: input
    };

    setMessages([...messages, newMsg]);
    setInput("");

    // Simula uma resposta do NorteBot
    if (input.toLowerCase().includes("orçamento") || input.toLowerCase().includes("portfólio")) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "bot",
          sender: "ME",
          isCard: true,
          cardData: {
            type: "PORTFOLIO_CARD",
            title: "Proposta Norte SaaS",
            reason: "Orçamento Enterprise 10k/mês",
            score: 100
          }
        }]);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
      
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://i.pravatar.cc/150?u=joao" className="w-10 h-10 rounded-full border border-slate-700" alt="João"/>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">João Dev</h3>
            <span className="text-xs text-slate-400">Affinity Score: 98%</span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex w-full ${msg.sender === "ME" ? "justify-end" : "justify-start"}`}
          >
            {msg.isCard ? (
              <div className={`max-w-[80%] rounded-2xl border p-4 ${msg.sender === "ME" ? "bg-cyan-900/20 border-cyan-500/30" : "bg-violet-900/20 border-violet-500/30"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {msg.cardData.type === "AFFINITY_MATCH" ? <Heart size={16} className="text-violet-400"/> : <Briefcase size={16} className="text-cyan-400"/>}
                  <span className={`text-xs font-bold uppercase tracking-widest ${msg.sender === "ME" ? "text-cyan-400" : "text-violet-400"}`}>
                    {msg.cardData.title}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{msg.cardData.reason}</p>
                <button className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${msg.sender === "ME" ? "bg-cyan-600 hover:bg-cyan-500 text-white" : "bg-violet-600 hover:bg-violet-500 text-white"}`}>
                  {msg.cardData.type === "AFFINITY_MATCH" ? "Aceitar Conexão" : "Ver Proposta"}
                </button>
              </div>
            ) : (
              <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm ${msg.sender === "ME" ? "bg-cyan-600 text-white rounded-br-sm" : "bg-slate-800 text-slate-200 rounded-bl-sm"}`}>
                {msg.text}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-cyan-400 transition-colors">
            <Cpu size={20} />
          </button>
          <button type="button" className="p-3 text-slate-400 hover:text-cyan-400 transition-colors">
            <ImageIcon size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem ou digite 'portfólio'..."
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-cyan-600"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
