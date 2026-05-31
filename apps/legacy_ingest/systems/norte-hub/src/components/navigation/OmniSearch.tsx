"use client";
import React, { useState, useEffect } from 'react';
import { Search, Terminal, Activity, Book, HardDrive } from 'lucide-react';

const OmniSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const modules = [
    { id: 'vigia', title: 'Vigía Estoico', icon: <Activity size={16} />, desc: 'Treino PPL & Macros' },
    { id: 'escritura', title: 'Escritura & Legado', icon: <Book size={16} />, desc: 'Diário & Manuscritos' },
    { id: 'atelie', title: 'Ateliê Digital', icon: <Terminal size={16} />, desc: 'IDE & DAW Status' },
    { id: 'soberania', title: 'Nível de Soberania', icon: <HardDrive size={16} />, desc: 'Métricas do Ecossistema' },
  ];

  const filteredModules = modules.filter((mod) =>
    mod.title.toLowerCase().includes(query.toLowerCase()) ||
    mod.desc.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-norte-black border border-norte-emerald w-full max-w-2xl rounded-lg shadow-2xl shadow-norte-emerald/20 overflow-hidden font-mono">
        
        {/* SEARCH INPUT */}
        <div className="flex items-center border-b border-norte-emerald/30 p-4">
          <Search className="text-norte-emerald mr-3" size={20} />
          <input
            type="text"
            placeholder="Digite um comando ou busque um módulo..."
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-norte-emerald/30 text-sm"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            autoFocus
          />
          <div className="text-xs text-norte-emerald/50 bg-norte-emerald/5 px-2 py-1 border border-norte-emerald/20">
            ESC para fechar
          </div>
        </div>

        {/* RESULTS */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredModules.length > 0 ? (
            filteredModules.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center p-3 hover:bg-norte-emerald/10 cursor-pointer group transition-colors"
              >
                <div className="text-norte-emerald group-hover:text-norte-orange mr-3 transition-colors">
                  {mod.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-sm font-bold">{mod.title}</h3>
                  <p className="text-xs text-norte-emerald/60">{mod.desc}</p>
                </div>
                <div className="text-xs text-norte-orange opacity-0 group-hover:opacity-100 transition-opacity">
                  ACESSAR _
                </div>
              </div>
            ))
          ) : (
            <div className="text-norte-emerald/50 text-sm p-4 text-center">
              Nenhum módulo encontrado.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-norte-emerald/10 p-3 bg-black/50 flex justify-between items-center text-xs text-norte-emerald/40">
          <span>Antigravity OS v1.0</span>
          <span>Norte Global Hub</span>
        </div>
      </div>
    </div>
  );
};

export default OmniSearch;
