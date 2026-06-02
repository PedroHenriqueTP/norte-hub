'use client';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const systemNames = {
  autoshop: "AutoShop",
  clinic: "Clinic",
  fit: "Fit",
  study: "Study",
  core: "Tech"
};

const sysHues = {
  autoshop: 45,
  clinic: 120,
  fit: 20,
  study: 270,
  core: 180
};

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AuthGateway() {
  const searchParams = useSearchParams();
  const sys = (searchParams.get('sys') || 'core') as keyof typeof systemNames;
  const colorName = searchParams.get('color') || 'core';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Validando Tenant localmente...");
    window.location.href = 'http://localhost:3001'; // Simula redirecionamento
  };

  const displayName = systemNames[sys] || sys.toUpperCase();

  return (
    <main className="min-h-screen flex text-white bg-norte-graphite">
      {/* Lado A: Formulário (Foco) */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card w-full max-w-sm p-10 border-white/10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter uppercase">
              Norte <span style={{ color: `var(--norte-${colorName})` }}>{displayName}</span>
            </h2>
            <p className="text-white/40 text-sm mt-2">Acesse seu Tenant</p>
          </div>
          
          <div className="space-y-4">
            {/* Botão Google */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-lg font-semibold hover:bg-white/90 transition-all">
              <GoogleIcon /> Continuar com Google
            </button>
            
            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-white/20 text-xs uppercase tracking-widest">ou entrar com e-mail</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Form de Login */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <input 
                type="email" 
                placeholder="E-mail profissional" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
              />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
              />
              
              <button 
                type="submit" 
                className="w-full py-3 rounded-lg font-bold text-black transition-all"
                style={{ backgroundColor: `var(--norte-${colorName})` }}
              >
                Acessar Sistema
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <span className="text-white/30 text-xs">Não tem uma conta? </span>
            <button className="text-white text-xs hover:underline">Cadastre sua Empresa</button>
          </div>
        </motion.div>
      </section>

      {/* Lado B: Visual Cinemático (Reativo) */}
      <section className="flex-1 relative overflow-hidden hidden md:block">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-100 hover:scale-105"
          style={{ 
            backgroundImage: "url('/cyber-bg.png')",
            filter: `grayscale(0.8) brightness(0.5) saturate(1.5) hue-rotate(${sysHues[sys] || 0}deg)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-10 bg-black/30 backdrop-blur-sm rounded-lg border border-white/5 max-w-lg">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-2">Workspace Integrado</p>
            <h3 className="text-3xl font-bold tracking-tighter mb-4">Sua infraestrutura, suas regras.</h3>
            <p className="text-white/60 text-sm">O ecossistema Norte unifica suas ferramentas de gestão sob uma única camada de segurança e performance.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
