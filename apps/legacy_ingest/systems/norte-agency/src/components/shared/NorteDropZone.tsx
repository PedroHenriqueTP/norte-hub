"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Send, Loader2, HeartPulse, DollarSign, Utensils } from "lucide-react";
import { toast } from "sonner";

// Simulando a extração do Omni-Router
type FileCategory = "FINTECH" | "HEALTH" | "GASTRO" | "NEUTRAL";

const BG_COLORS = {
  FINTECH: "from-emerald-900/40 via-slate-900 to-slate-950",
  HEALTH: "from-blue-900/40 via-slate-900 to-slate-950",
  GASTRO: "from-orange-900/40 via-slate-900 to-slate-950",
  NEUTRAL: "from-violet-900/40 via-slate-900 to-slate-950"
};

const BORDER_COLORS = {
  FINTECH: "border-emerald-500",
  HEALTH: "border-blue-500",
  GASTRO: "border-orange-500",
  NEUTRAL: "border-violet-500"
};

export function NorteDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<FileCategory>("NEUTRAL");
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      analyzeFileContext(droppedFile.name);
    }
  }, []);

  // Simula a Visão Computacional do Córtex Neural
  const analyzeFileContext = (filename: string) => {
    const name = filename.toLowerCase();
    if (name.includes("nf") || name.includes("nota") || name.includes("fatura")) {
      setCategory("FINTECH");
      toast("Nota Fiscal Detectada", { icon: <DollarSign className="text-emerald-500"/> });
    } else if (name.includes("receita") || name.includes("treino") || name.includes("exame")) {
      setCategory("HEALTH");
      toast("Documento Clínico Detectada", { icon: <HeartPulse className="text-blue-500"/> });
    } else if (name.includes("cardapio") || name.includes("insumos")) {
      setCategory("GASTRO");
      toast("Cardápio/Insumos Detectado", { icon: <Utensils className="text-orange-500"/> });
    } else {
      setCategory("NEUTRAL");
    }
  };

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !command) return;
    
    setIsProcessing(true);
    
    // Simula o processamento via omni-router.service.ts
    setTimeout(() => {
      setIsProcessing(false);
      setFile(null);
      setCommand("");
      setCategory("NEUTRAL");
      
      toast.success("Omni-Drop: Intenção Processada!", {
        description: "A I.A. liquidou o documento e despachou as ações no Ecossistema.",
      });
    }, 2000);
  };

  return (
    <motion.div 
      className={`w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-white/5 transition-all duration-1000 bg-gradient-to-br ${BG_COLORS[category]}`}
      layout
    >
      {/* DRAG AND DROP ZONE */}
      <div 
        className={`relative p-12 flex flex-col items-center justify-center min-h-[300px] transition-all duration-300 border-2 border-dashed mx-6 mt-6 rounded-2xl ${isDragging ? BORDER_COLORS[category] + ' bg-black/40' : 'border-slate-700/50 hover:border-slate-600 bg-black/20'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-slate-400 pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 shadow-xl">
                <UploadCloud size={28} className={isDragging ? `text-${BORDER_COLORS[category].replace('border-', '')}` : 'text-slate-300'} />
              </div>
              <p className="text-lg font-bold text-white mb-1">Omni-Drop Portal</p>
              <p className="text-sm text-center">Arraste Notas Fiscais, Receitas ou PDFs.<br/>O Córtex classificará automaticamente.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="file"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border shadow-2xl relative overflow-hidden">
                <div className={`absolute inset-0 opacity-20 ${category === 'FINTECH' ? 'bg-emerald-500' : category === 'HEALTH' ? 'bg-blue-500' : category === 'GASTRO' ? 'bg-orange-500' : 'bg-violet-500'}`}></div>
                <FileText size={28} className="text-white relative z-10" />
              </div>
              <p className="text-lg font-bold text-white max-w-[250px] truncate">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Documento Escaneado</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COMMAND INPUT */}
      <div className="p-6">
        <form onSubmit={handleProcess} className="relative">
          <input 
            type="text" 
            placeholder={file ? 'Ex: "Líquide esta nota fiscal no Enterprise Payroll"' : 'Arraste um arquivo ou digite um comando...'}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all shadow-inner"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isProcessing}
          />
          <button 
            type="submit" 
            disabled={isProcessing || (!file && !command)}
            className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-violet-600"
          >
            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
