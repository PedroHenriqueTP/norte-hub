import { motion } from 'framer-motion';

export const BioStatus = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
      {/* Glow de Fundo */}
      <div className="absolute w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
      
      {/* Silhueta Simbolizando 2.10m / 125kg */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-32 h-32 rounded-full border-2 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-400/5 mb-8" />
        <div className="w-48 h-80 rounded-t-[60px] border-x-2 border-t-2 border-emerald-400/40 shadow-[0_0_40px_rgba(16,185,129,0.1)] bg-gradient-to-b from-emerald-400/10 to-transparent" />
        
        {/* Labels de Performance */}
        <div className="absolute top-10 -right-32 flex flex-col gap-2">
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Estatura</span>
          <span className="text-3xl font-black text-white">2.10<span className="text-emerald-400">m</span></span>
        </div>
        
        <div className="absolute bottom-20 -left-32 flex flex-col gap-2 text-right">
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Massa Bruta</span>
          <span className="text-3xl font-black text-white">125<span className="text-emerald-400">kg</span></span>
        </div>
      </motion.div>

      {/* Grid de Sensores */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
    </div>
  );
};
