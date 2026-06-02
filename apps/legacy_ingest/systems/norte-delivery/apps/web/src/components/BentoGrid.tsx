'use client';
import Link from 'next/link';

const systems = [
  { id: 'autoshop', title: 'Norte AutoShop', color: 'border-norte-shop/40', category: 'Gestão Automotiva', colorName: 'shop' },
  { id: 'clinic', title: 'Norte Clinic', color: 'border-norte-cura/40', category: 'Saúde & CRM', colorName: 'cura' },
  { id: 'fit', title: 'Norte Fit', color: 'border-norte-fit/40', category: 'Performance Humana', colorName: 'fit' },
  { id: 'study', title: 'Norte Study', color: 'border-norte-study/40', category: 'Educação & IA', colorName: 'study' },
];

export const BentoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full max-w-7xl px-4 pb-20">
      {systems.map((sys) => (
        <div
          key={sys.id}
          className={`glass-card border ${sys.color} p-6 flex flex-col justify-between h-48`}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{sys.category}</p>
            <h3 className="text-xl font-medium text-white/90">{sys.title}</h3>
          </div>
          
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono opacity-60 italic">Online</span>
            <Link 
              href={`/auth?sys=${sys.id}&color=${sys.colorName}`}
              className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all"
            >
              Launch
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
