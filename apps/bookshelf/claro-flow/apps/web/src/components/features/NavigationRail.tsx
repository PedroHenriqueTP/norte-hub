'use client';

import React from 'react';

type NavigationRailProps = {
  sections: { id: string; label: string }[];
  activeSection: string;
};

export const NavigationRail: React.FC<NavigationRailProps> = ({ sections, activeSection }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-center">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <div key={section.id} className="relative group flex items-center justify-end w-32 cursor-pointer" onClick={() => scrollTo(section.id)}>
            <span className={`absolute right-8 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'opacity-100 text-[#ee1d23]' : 'opacity-0 text-white group-hover:opacity-100'}`}>
              {section.label}
            </span>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-[#ee1d23] scale-150 shadow-[0_0_10px_rgba(238,29,35,0.8)]' : 'bg-white/30 hover:bg-white'}`} />
          </div>
        );
      })}
    </div>
  );
};
