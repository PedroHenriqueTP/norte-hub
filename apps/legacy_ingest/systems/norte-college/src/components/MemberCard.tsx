import { motion } from 'framer-motion';

export const MemberCard = ({ tier = 'OBSIDIAN' }) => (
  <motion.div 
    whileHover={{ rotateY: 15, rotateX: -5 }}
    className="w-[350px] h-[200px] rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 p-6 relative overflow-hidden shadow-2xl"
  >
    <div className="absolute top-0 right-0 p-4 opacity-20">
      <div className="w-20 h-20 rounded-full border-4 border-emerald-400 blur-lg" />
    </div>
    <div className="flex flex-col justify-between h-full">
      <h3 className="text-white font-black tracking-widest text-lg">NORTE <span className="text-emerald-400">CLUB</span></h3>
      <div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Member Status</p>
        <p className="text-emerald-400 font-black text-2xl tracking-tighter">{tier} ELITE</p>
      </div>
    </div>
  </motion.div>
);
