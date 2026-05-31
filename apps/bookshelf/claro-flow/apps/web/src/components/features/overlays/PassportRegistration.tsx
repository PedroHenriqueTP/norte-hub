import React, { useState } from 'react';
import { useUiStore } from '../../../store/uiStore';
import { User, Mail, Briefcase, QrCode } from 'lucide-react';

export const PassportRegistration = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const { closeOverlay } = useUiStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando chamada de API assíncrona
    setTimeout(() => setIsRegistered(true), 1000);
  };

  if (isRegistered) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#ee1d23] flex items-center justify-center mb-6">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Acesso Liberado</h3>
        <p className="text-white/70 mb-8 max-w-sm">Este é o seu Passaporte Digital. Utilize este QR Code nas ativações presenciais do evento.</p>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 w-full max-w-sm">
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ClaroConecta_VIP" 
            alt="QR Code Passaporte" 
            className="w-48 h-48 mx-auto rounded-xl"
          />
        </div>

        <button 
          onClick={closeOverlay}
          className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-colors border border-white/20 w-full max-w-sm"
        >
          Retornar à Jornada
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Seu Passaporte</h3>
      <p className="text-white/70 mb-8 text-center max-w-md">Cadastre-se para liberar o acesso a conteúdos exclusivos, jogos e concorra a prêmios no final do evento.</p>

      <form onSubmit={handleRegister} className="w-full max-w-md flex flex-col gap-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Nome Completo" 
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#ee1d23]/50 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Empresa / Cargo" 
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#ee1d23]/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="email" 
            placeholder="E-mail Corporativo" 
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#ee1d23]/50 transition-colors"
          />
        </div>

        <button 
          type="submit"
          className="mt-4 bg-[#ee1d23] hover:bg-[#ee1d23]/80 text-white px-8 py-4 rounded-xl font-bold transition-colors w-full uppercase tracking-wider"
        >
          Gerar Acesso
        </button>
      </form>
    </div>
  );
};
