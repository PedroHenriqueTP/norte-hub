'use client';
import { motion } from 'framer-motion';

export const SystemSwitcher = ({ systemName, color }: { systemName: string, color: string }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[100] bg-norte-graphite flex flex-col items-center justify-center"
  >
    <div className={`w-24 h-24 border-t-4 ${color} rounded-full animate-spin mb-8`} />
    <h2 className="text-white text-2xl font-light tracking-widest uppercase">
      Conectando ao <span className="font-bold">{systemName}</span>
    </h2>
    <p className="text-white/40 mt-2 font-mono text-xs">Validando credenciais do ecossistema...</p>
  </motion.div>
);
