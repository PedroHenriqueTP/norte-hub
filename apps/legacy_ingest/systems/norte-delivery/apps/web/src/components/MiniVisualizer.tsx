'use client';
import { motion } from 'framer-motion';

export const MiniVisualizer = ({ color }: { color: string }) => {
  // Simula pontos de um gráfico
  const points = [10, 25, 15, 40, 30, 55, 45, 70];
  
  return (
    <div className="flex items-end gap-1 h-8 w-full mt-4 opacity-50">
      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${p}%` }}
          transition={{ delay: i * 0.05, repeat: Infinity, repeatType: 'reverse', duration: 2 }}
          style={{ backgroundColor: color }}
          className="w-full rounded-t-[1px]"
        />
      ))}
    </div>
  );
};
