'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    slug: '',
    businessType: 'autoshop',
    email: '',
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando Empresa...", formData);
    // Simula sucesso e redireciona para o login
    window.location.href = `/auth?sys=${formData.businessType}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-norte-graphite relative overflow-hidden">
      {/* Aura de fundo */}
      <div className="absolute w-[500px] h-[500px] blur-[150px] opacity-10 bg-norte-core" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 w-full max-w-lg border-white/10 z-10 my-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">
            Cadastre sua Empresa
          </h2>
          <p className="text-white/40 text-sm">Crie seu Tenant e comece a operar</p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Dados da Empresa */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Dados da Empresa</label>
            <input 
              type="text" 
              placeholder="Nome da Concessionária ou Clínica" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
            />
            <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-lg p-3">
              <span className="text-white/30 text-sm">norte.systems/</span>
              <input 
                type="text" 
                placeholder="subdominio-unico" 
                className="bg-transparent text-white focus:outline-none w-full"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Tipo de Negócio */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Tipo de Negócio</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className={`p-3 rounded-lg border ${formData.businessType === 'autoshop' ? 'border-norte-shop text-white' : 'border-white/10 text-white/50'} bg-white/5 hover:bg-white/10 transition-all`}
                onClick={() => setFormData({...formData, businessType: 'autoshop'})}
              >
                Norte AutoShop
              </button>
              <button 
                type="button"
                className={`p-3 rounded-lg border ${formData.businessType === 'clinic' ? 'border-norte-cura text-white' : 'border-white/10 text-white/50'} bg-white/5 hover:bg-white/10 transition-all`}
                onClick={() => setFormData({...formData, businessType: 'clinic'})}
              >
                Norte Clinic
              </button>
            </div>
          </div>

          {/* Admin Root */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50">Administrador Root</label>
            <input 
              type="email" 
              placeholder="E-mail do proprietário" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Senha de acesso" 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full py-3 rounded-lg font-bold text-black bg-white hover:bg-white/90 transition-all">
            Criar Tenant & Acessar
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-white/30 text-xs">Já tem uma conta? </span>
          <Link href="/auth" className="text-white text-xs hover:underline">Fazer Login</Link>
        </div>
      </motion.div>
    </main>
  );
}
