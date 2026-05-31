"use client";

import React, { useState } from "react";
import { generatePresentationData } from "@/actions/presentation";
import { Loader2, Download, Presentation, Sparkles } from "lucide-react";
import pptxgen from "pptxgenjs";

export default function PresentationsPage() {
  const [topic, setTopic] = useState("Proposta de Novo Portal e Automação de Leads");
  const [includeROI, setIncludeROI] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const response = await generatePresentationData(topic, includeROI);
      
      if (response.success && response.presentationData) {
        const pres = new pptxgen();
        const data = response.presentationData;
        const brand = response.brandConfig;

        // Master Slide Layout setup
        pres.defineSlideMaster({
          title: "MASTER_SLIDE",
          background: { color: brand.colors.background || "FFFFFF" },
          objects: [
            { rect: { x: 0, y: 0, w: "100%", h: 0.75, fill: { color: brand.colors.primary.replace("#", "") } } },
            { text: { text: "É a Norte!", options: { x: 0.5, y: 0.2, w: 3, h: 0.3, color: "FFFFFF", bold: true, fontSize: 18 } } }
          ]
        });

        // Capa
        const slideCapa = pres.addSlide({ masterName: "MASTER_SLIDE" });
        slideCapa.addText(data.title, { x: 1, y: 2, w: 8, h: 1, fontSize: 44, bold: true, color: brand.colors.primary.replace("#", ""), align: "center" });
        slideCapa.addText(data.subtitle, { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 24, color: "666666", align: "center" });

        // Slides gerados pela IA
        data.slides.forEach(slideData => {
          const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
          
          // Título do Slide
          slide.addText(slideData.title, { 
            x: 0.5, y: 1.0, w: 9, h: 0.5, 
            fontSize: 32, bold: true, color: brand.colors.secondary.replace("#", "") 
          });

          // Conteúdo em tópicos
          const bullets = slideData.content.map(text => ({ text, options: { bullet: true, fontSize: 22, color: "333333", breakLine: true } }));
          slide.addText(bullets as any, { x: 0.5, y: 2.0, w: 9, h: 3, align: "left" });

          // Notas de Apresentador
          if (slideData.notes) {
            slide.addNotes(slideData.notes);
          }
        });

        // Baixar arquivo
        pres.writeFile({ fileName: `Pitch_Norte_${topic.replace(/\s+/g, "_")}.pptx` });
      }
    } catch (error) {
      console.error("Falha ao gerar PPTX:", error);
      alert("Erro ao gerar a apresentação. Verifique o console.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 w-full">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-violet-100 text-violet-700 rounded-xl">
          <Presentation size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Norte Pitch (Agente de Apresentações)</h1>
          <p className="text-slate-500">Transforme o DNA da sua agência em um Pitch Deck de alta conversão gerado por IA.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Tópico Principal da Apresentação</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none text-slate-800"
            placeholder="Ex: Novo portal corporativo..."
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="roi"
            checked={includeROI}
            onChange={(e) => setIncludeROI(e.target.checked)}
            className="w-5 h-5 text-violet-600 rounded border-slate-300"
          />
          <label htmlFor="roi" className="text-slate-700 font-medium">
            Incluir Projeções de ROI, Métricas de Billing e Lucratividade (Para tickets Enterprise)
          </label>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processando DNA e Gerando Slides...
            </>
          ) : (
            <>
              <Sparkles size={20} className="text-violet-400" />
              <Download size={20} />
              Gerar & Baixar Pitch Deck (.pptx)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
