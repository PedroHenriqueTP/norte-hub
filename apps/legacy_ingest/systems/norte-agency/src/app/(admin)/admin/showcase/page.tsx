import React from "react";
import fs from "fs/promises";
import path from "path";
import { Layers, Rocket, Code2, Globe } from "lucide-react";

export default async function ShowcasePage() {
  // Ler o PROJETO_DNA.md nativamente no servidor
  let dnaContent = "";
  try {
    const dnaPath = path.join(process.cwd(), "PROJETO_DNA.md");
    dnaContent = await fs.readFile(dnaPath, "utf-8");
  } catch (error) {
    dnaContent = "DNA Base: AgencyOS - Ecossistema Multi-tenant para a Norte. Integra Billing, Leads e Provisionamento Automático via IA.";
  }

  // Uma extração simples baseada em markdown heading/bullet para fins visuais
  const sections = dnaContent.split("##").filter(Boolean);

  return (
    <div className="p-8 w-full max-w-5xl mx-auto space-y-10">
      
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-full w-max">
          <Rocket size={14} /> Apresentação de Projetos
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2">Norte DNA Showcase</h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          Visualização automatizada da fundação da agência, gerada dinamicamente a partir do manifesto técnico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.slice(0, 4).map((section, idx) => {
          const lines = section.trim().split("\n");
          const title = lines[0].replace(/#/g, "").trim();
          const content = lines.slice(1).join("\n").trim();
          
          const Icon = idx === 0 ? Code2 : idx === 1 ? Layers : Globe;

          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 text-slate-100 group-hover:text-blue-50 transition-colors z-0">
                <Icon size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                   {title}
                </h3>
                <div className="text-sm text-slate-600 prose prose-sm prose-slate max-w-none">
                  {content.substring(0, 300)}...
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Exportar DNA como Documento Executivo</h2>
          <p className="text-slate-400 max-w-2xl mb-8">
            Os metadados técnicos já estão acoplados. Você pode direcionar essa estrutura arquitetural para o Norte Pitch para gerar slides comerciais, ou para o Provisionador para espelhar ambientes.
          </p>
          <div className="flex gap-4">
            <a href="/admin/presentations" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
              Ir para o Norte Pitch (PowerPoint)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
