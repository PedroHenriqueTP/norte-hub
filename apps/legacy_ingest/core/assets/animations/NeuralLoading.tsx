// Animação de Expansão Neural - Estética Neo-Radioativo
export const NeuralLoading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A] z-50">
    <motion.div 
      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-32 h-32"
    >
      {/* Cérebro/Galáxia em Expansão */}
      <div className="absolute inset-0 rounded-full border-2 border-[#00F2FF] blur-xl opacity-50 animate-pulse" />
      <img src="/assets/logo-norte-systems.svg" className="w-full h-full p-4 relative z-10" />
    </motion.div>
  </div>
);
