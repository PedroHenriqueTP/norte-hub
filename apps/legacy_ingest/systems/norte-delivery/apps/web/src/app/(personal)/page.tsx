'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Activity, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

const APPS = [
  {
    id: 'clock',
    name: 'Norte Clock',
    description: 'Gestão de foco, blocos Pomodoro e alarmes de rotina.',
    icon: Clock,
    color: 'from-orange-500/20 to-amber-500/10',
    iconColor: 'text-orange-400',
    path: '/clock'
  },
  {
    id: 'training',
    name: 'Norte Training',
    description: 'Histórico de cargas, treinos e records pessoais.',
    icon: Dumbbell,
    color: 'from-emerald-500/20 to-teal-500/10',
    iconColor: 'text-emerald-400',
    path: '/training'
  },
  {
    id: 'fit',
    name: 'Norte Fit',
    description: 'Macros, dieta preditiva e insights nutricionais do Cortex.',
    icon: Activity,
    color: 'from-cyan-500/20 to-blue-500/10',
    iconColor: 'text-cyan-400',
    path: '/fit'
  }
];

export default function PersonalAppLauncher() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-norte-graphite relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[length:32px_32px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl w-full space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 mb-2">
            <User className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Norte Personal
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">
            Central de controle individual. Selecione o micro-app para carregar a instância isolada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                href={app.path}
                className={`block h-full p-6 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-md group hover:border-white/10 transition-all duration-300 relative overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${app.color}`} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                      <app.icon className={`w-6 h-6 ${app.iconColor}`} />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {app.name}
                  </h2>
                  <p className="text-sm text-white/50 mb-8 flex-1">
                    {app.description}
                  </p>
                  <div className="flex items-center text-sm font-semibold text-white/30 group-hover:text-white transition-colors">
                    Abrir App
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
