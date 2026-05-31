import { motion } from 'framer-motion';

export default function IdentityGate() {
    return (
        <div className="h-screen bg-[#020202] flex flex-col items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-12 border border-emerald-400/20 bg-emerald-400/5 rounded-[50px] backdrop-blur-3xl text-center"
            >
                <h1 className="text-white font-black text-4xl mb-2 tracking-tighter">NORTE <span className="text-emerald-400">IDENTITY</span></h1>
                <p className="text-emerald-400/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Authorized Members Only</p>
                <input type="password" placeholder="NEURAL_KEY" className="bg-black/50 border border-white/10 p-4 rounded-2xl w-64 text-center text-emerald-400 focus:border-emerald-400 outline-none transition-all" />
            </motion.div>
        </div>
    );
}
