"use client";

import React, { useState } from "react";

interface ModuleCard {
  key: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

export default function ModuleManagement() {
  const [activeModules, setActiveModules] = useState<string[]>(["AUTOSHOP"]);

  const modules: ModuleCard[] = [
    { key: "AUTOSHOP", name: "AutoShop Core", desc: "Gestão multi-tenant de frotas e vendas de veículos.", color: "border-brand-orange text-brand-orange", icon: "🚗" },
    { key: "MEDCURA", name: "MedCura CRM", desc: "Prontuários e controle clínico integrado com telemedicina.", color: "border-brand-red text-brand-red", icon: "🏥" },
    { key: "AGENCY_OS", name: "AgencyOS Matrix", desc: "Automação multi-canal de tráfego, Google Ads e leads.", color: "border-brand-green text-brand-green", icon: "📊" },
  ];

  const handleToggle = (key: string) => {
    if (activeModules.includes(key)) {
      setActiveModules(activeModules.filter((item) => item !== key));
    } else {
      setActiveModules([...activeModules, key]);
    }
  };

  return (
    <div id="module-management-container" className="min-h-screen w-full bg-brand-canvas p-8 text-brand-text font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 id="module-management-title" className="text-2xl font-bold tracking-tight">Módulos do Ecossistema</h1>
          <p id="module-management-desc" className="text-sm text-brand-subtle mt-1">
            Ative ou suspenda sistemas pré-configurados com base nas licenças ativas do tenant.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((mod) => {
            const isEnabled = activeModules.includes(mod.key);
            return (
              <div key={mod.key} className="bg-brand-surface border border-gray-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{mod.icon}</span>
                    <span
                      id={`module-tag-${mod.key.toLowerCase()}`}
                      className={`text-[10px] font-bold px-2.5 py-1 border rounded-full uppercase tracking-wider ${mod.color}`}
                    >
                      {mod.key}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{mod.name}</h3>
                  <p className="text-xs text-brand-subtle leading-relaxed">{mod.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-subtle">Status</span>
                  <button
                    id={`module-toggle-${mod.key.toLowerCase()}`}
                    onClick={() => handleToggle(mod.key)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isEnabled 
                        ? "bg-brand-canvas text-brand-text border border-gray-300 hover:bg-gray-50" 
                        : "bg-brand-text text-white hover:bg-black"
                    }`}
                  >
                    {isEnabled ? "Ativo (Desativar)" : "Ativar Módulo"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
