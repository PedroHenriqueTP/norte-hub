import { AppLauncher, AppService } from '@/components/AppLauncher';
import { Dumbbell, Cloud, Clock, ShieldAlert } from 'lucide-react';

export default function HubPage() {
  const ecosystemServices: AppService[] = [
    {
      id: 'norte-gym',
      title: 'Norte Gym',
      description: 'Gestão operacional de unidades, controle de matrículas e feed de catraca síncrono.',
      href: '/gym',
      icon: <Dumbbell className="h-6 w-6 text-emerald-400" />,
      isActive: true,
    },
    {
      id: 'norte-cloud',
      title: 'Norte Cloud',
      description: 'Drive síncrono híbrido com indexação proativa e busca cognitiva por IA.',
      href: '/cloud',
      icon: <Cloud className="h-6 w-6 text-orange-500" />,
      isActive: true,
    },
    {
      id: 'norte-clock',
      title: 'Norte Clock',
      description: 'Alta performance pessoal através de blocos de foco Pomodoro e alarmes de rotina.',
      href: '/clock',
      icon: <Clock className="h-6 w-6 text-emerald-500" />,
      isActive: true,
    },
    {
      id: 'norte-admin',
      title: 'SaaS Governance',
      description: 'Painel administrativo central de faturamento, controle de inquilinos e IDOR mitigation.',
      href: '/admin',
      icon: <ShieldAlert className="h-6 w-6 text-zinc-500" />,
      isActive: false,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-50 selection:bg-emerald-500/20">
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <header className="mb-16 max-w-3xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Cortex Neural Connected
          </div>
          <h1 className="mt-4 text-5xl font-black tracking-tighter sm:text-6xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Command Deck
          </h1>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-xl">
            Selecione o módulo operacional isolado. O barramento de autenticação e o contexto de tenant serão injetados de forma transparente.
          </p>
        </header>
        
        <section className="animate-fade-in">
          <AppLauncher services={ecosystemServices} />
        </section>
      </div>
    </main>
  );
}