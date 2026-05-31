import Link from 'next/link';
import { ReactNode } from 'react';

export interface AppService {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  isActive: boolean;
}

interface AppLauncherProps {
  services: AppService[];
}

export function AppLauncher({ services }: AppLauncherProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {services.map((service) => (
        <Link
          key={service.id}
          href={service.href}
          className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-500 hover:border-zinc-600 hover:bg-zinc-800/80 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] ${
            !service.isActive ? 'pointer-events-none opacity-40 grayscale' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-100 ring-1 ring-zinc-700/50 transition-transform duration-500 group-hover:scale-110 group-hover:ring-zinc-500">
              {service.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-100">{service.title}</h3>
              <p className="text-sm font-medium text-zinc-400 leading-relaxed">{service.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}