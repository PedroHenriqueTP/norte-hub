import { motion } from 'framer-motion';

export const VirilizationCard = ({ animalRatio = 0.85 }) => {
  return (
    <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase mb-1">Análise Bioquímica</h3>
          <h2 className="text-2xl font-black text-white">Virilização Elite</h2>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-emerald-400">{(animalRatio * 100).toFixed(0)}%</span>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Potencial Anabólico</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: ${animalRatio * 100}% }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Proteína Animal</span>
            <p className="text-lg font-bold text-white">Alta Densidade</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Fitoestrógenos</span>
            <p className="text-lg font-bold text-white">Nível Crítico (Baixo)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
