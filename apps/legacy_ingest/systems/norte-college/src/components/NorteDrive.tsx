import { motion } from 'framer-motion';
import { HardDrive, File, FolderPlus } from 'lucide-react';

export const NorteDrive = () => {
  return (
    <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <HardDrive className="text-emerald-400 w-8 h-8" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Knowledge <span className="text-emerald-400">Vault</span></h2>
        </div>
        <button className="p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl text-emerald-400">
          <FolderPlus className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-4 cursor-pointer">
            <File className="text-white/20 w-10 h-10" />
            <span className="text-[10px] text-white/40 font-bold uppercase">File_System_0{i}.bin</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
