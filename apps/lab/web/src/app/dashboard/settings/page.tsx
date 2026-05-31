"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState({
    googleDrive: "",
    notion: "",
    gemini: "",
  });

  const handleSave = async (provider: string, value: string) => {
    setLoading(true);
    await fetch("/api/connections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tenant-id": "current-tenant-uuid-here",
      },
      body: JSON.stringify({ provider, token: value }),
    });
    setLoading(false);
  };

  return (
    <main id="settings-page-container" className="min-h-screen w-full bg-brand-canvas p-8 text-brand-text font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Conexões do Laboratório</h1>
          <p className="text-sm text-brand-subtle mt-1">
            Gerencie suas credenciais e chaves de API com segurança ponta a ponta criptografada via AES-256-GCM.
          </p>
        </header>

        <hr className="border-gray-200" />

        <section className="grid gap-6">
          <div className="bg-brand-surface border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-brand-cyan"></span>
                <h3 className="font-semibold text-base">Google Drive Data Lake</h3>
              </div>
              <p className="text-sm text-brand-subtle max-w-md">
                Armazenamento modular automático de contextos purificados e Markdowns técnicos de produto.
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <input
                id="google-drive-token-input"
                type="password"
                placeholder="Refresh Token ou Service Account JSON"
                className="w-full md:w-64 bg-brand-canvas border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-cyan"
                value={keys.googleDrive}
                onChange={(e) => setKeys({ ...keys, googleDrive: e.target.value })}
              />
              <button
                id="google-drive-connect-btn"
                onClick={() => handleSave("GOOGLE_DRIVE", keys.googleDrive)}
                disabled={loading}
                className="px-4 py-2 bg-brand-text text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
              >
                Conectar
              </button>
            </div>
          </div>

          <div className="bg-brand-surface border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-brand-green"></span>
                <h3 className="font-semibold text-base">Notion Workspace</h3>
              </div>
              <p className="text-sm text-brand-subtle max-w-md">
                Sincronização bidirecional de mockups, ideias conceituais e quadros Kanban de tarefas.
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <input
                id="notion-token-input"
                type="password"
                placeholder="Notion Internal Integration Token"
                className="w-full md:w-64 bg-brand-canvas border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-green"
                value={keys.notion}
                onChange={(e) => setKeys({ ...keys, notion: e.target.value })}
              />
              <button
                id="notion-connect-btn"
                onClick={() => handleSave("NOTION", keys.notion)}
                disabled={loading}
                className="px-4 py-2 bg-brand-text text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
              >
                Conectar
              </button>
            </div>
          </div>

          <div className="bg-brand-surface border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-brand-violet"></span>
                <h3 className="font-semibold text-base">Gemini LLM Core</h3>
              </div>
              <p className="text-sm text-brand-subtle max-w-md">
                Motor analítico responsável por processar e categorizar inputs brutos de forma preditiva.
              </p>
            </div>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <input
                id="gemini-token-input"
                type="password"
                placeholder="AIZA Sy..."
                className="w-full md:w-64 bg-brand-canvas border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-violet"
                value={keys.gemini}
                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
              />
              <button
                id="gemini-connect-btn"
                onClick={() => handleSave("GEMINI", keys.gemini)}
                disabled={loading}
                className="px-4 py-2 bg-brand-text text-white rounded-xl text-sm font-medium hover:bg-black transition-colors"
              >
                Conectar
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
