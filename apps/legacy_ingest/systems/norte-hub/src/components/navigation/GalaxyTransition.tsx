import { motion, AnimatePresence } from 'framer-motion';

export const GalaxyTransition = ({ isLaunching }: { isLaunching: boolean }) => {
  return (
    <AnimatePresence>
      {isLaunching && (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: 1, 
            scale: 15,
            filter: "blur(40px) brightness(2)"
          }}
          transition={{ duration: 1.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[100] bg-cyan-400 pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        >
          {/* Partículas de Velocidade da Luz */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,transparent_10%)] bg-[length:20px_20px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
