"use client";

import React, { useState } from "react";

export default function DashboardLab() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-brand-canvas text-brand-text font-sans">
      <aside className={`${sidebarOpen ? "w-80" : "w-16"} flex flex-col border-r border-gray-200 bg-brand-surface transition-all duration-300 ease-in-out`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && <span className="font-bold tracking-tight text-lg text-brand-violet">Norte Lab</span>}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-gray-100 text-brand-subtle"
          >
            ⚡
          </button>
        </div>
        
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="rounded-xl p-4 border border-gray-100 bg-brand-canvas">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-orange mb-2">Saúde do Contexto</h3>
              <p className="text-sm font-medium">94% Otimizado — Módulos MD Limpos</p>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-cyan mb-3">File Pool (Acesso Rápido)</h3>
              <div
                id="file-pool-dropzone"
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-sm text-brand-subtle hover:border-brand-cyan cursor-pointer transition-colors"
              >
                Arraste mockups ou logs aqui
              </div>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col bg-brand-canvas">
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 bg-brand-surface">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-700">Projeto Ativo:</span>
            <span
              id="active-project-badge"
              className="px-3 py-1 bg-brand-canvas border border-gray-200 rounded-full text-xs font-semibold text-brand-violet"
            >
              AutoShop SaaS
            </span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-3xl mx-auto bg-brand-surface border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm leading-relaxed">
              <span className="font-bold text-brand-violet">[Origem: Gemini]</span> Insira as regras de negócio brutas ou esquemas conceituais para que o NLP Router fragmente e envie a estrutura sanitizada diretamente para o Google Drive corporativo.
            </p>
          </div>
        </section>

        <div className="p-6 bg-brand-surface border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center border border-gray-300 rounded-xl bg-brand-canvas px-4 py-3 focus-within:border-brand-violet transition-colors">
            <input
              id="chat-input-field"
              type="text"
              placeholder="Digite um insight ou mencione @notion..."
              className="flex-1 bg-transparent outline-none text-sm placeholder-brand-subtle"
            />
            <button
              id="chat-submit-btn"
              className="ml-2 px-4 py-1.5 bg-brand-text text-white rounded-lg text-xs font-medium hover:bg-black transition-colors"
            >
              Refinar
            </button>
          </div>
        </div>
      </main>

      <aside className="w-72 border-l border-gray-200 bg-brand-surface flex flex-col hidden lg:flex">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm tracking-wide uppercase text-brand-subtle">Telemetria de Carga</h2>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between p-3 bg-brand-canvas border border-gray-100 rounded-xl">
            <span className="text-xs font-medium text-brand-subtle">Google Drive Sync</span>
            <span className="h-2 w-2 rounded-full bg-brand-green"></span>
          </div>
          <div className="flex items-center justify-between p-3 bg-brand-canvas border border-gray-100 rounded-xl">
            <span className="text-xs font-medium text-brand-subtle">OAuth Vault</span>
            <span className="text-xs font-mono font-bold text-brand-cyan">AES-READY</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
