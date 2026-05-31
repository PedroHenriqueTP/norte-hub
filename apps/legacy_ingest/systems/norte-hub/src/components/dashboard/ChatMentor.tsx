'use client';

import { useState } from 'react';

export default function ChatMentor() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'mentor', text: 'Salve, Pedrão. O corpo tá blindado e o cofre tá trancado. Qual é a ordem para hoje?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3333/hub/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'mentor', text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'mentor', text: 'O Mentor está meditando no momento. Mantenha a disciplina.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 border border-emerald-500/30 bg-black/80 backdrop-blur-md p-4 rounded-lg shadow-lg shadow-emerald-500/10 flex flex-col h-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-tighter">Mentor Estoico</h2>
        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 text-xs mb-4 font-mono">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.role === 'mentor' ? 'text-emerald-400' : 'text-white text-right'}`}>
            <span className="text-[10px] text-gray-500">{msg.role === 'mentor' ? '[MENTOR]:' : '[VOCÊ]:'}</span> {msg.text}
          </div>
        ))}
        {loading && <div className="text-orange-400 animate-pulse">[SISTEMA]: Processando sabedoria...</div>}
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Mande um salve..."
          className="flex-1 bg-gray-900 border border-emerald-500/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <button 
          onClick={sendMessage}
          className="border border-emerald-500 text-emerald-500 px-3 py-1 rounded text-xs hover:bg-emerald-500/10 transition-all"
        >
          ENVIAR
        </button>
      </div>
    </div>
  );
}
