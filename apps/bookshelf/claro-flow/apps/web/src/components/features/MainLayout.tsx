'use client';

import React, { useEffect, useState } from 'react';
import { NavigationRail } from './NavigationRail';
import { ChatbotWidget } from './ChatbotWidget';
import { GlassOverlay } from './GlassOverlay';
import { RecepcaoSection } from './sections/RecepcaoSection';
import { KeynoteSection } from './sections/KeynoteSection';
import { TechSection } from './sections/TechSection';
import { AwardsSection } from './sections/AwardsSection';
import { useUiStore } from '../../store/uiStore';
import { PassportRegistration } from './overlays/PassportRegistration';

export const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('recepcao');
  const { overlayContent, closeOverlay, openOverlay } = useUiStore();

  const sections = [
    { id: 'recepcao', label: 'Início', bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop' },
    { id: 'evento-1', label: 'Keynote', bg: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop' },
    { id: 'evento-2', label: 'Tech Panel', bg: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop' },
    { id: 'evento-3', label: 'Awards', bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white selection:bg-[#ee1d23]/30 scroll-smooth">
      <NavigationRail sections={sections} activeSection={activeSection} />

      {/* Sections */}
      <RecepcaoSection bgUrl={sections[0].bg} />
      <KeynoteSection bgUrl={sections[1].bg} />
      <TechSection bgUrl={sections[2].bg} />
      <AwardsSection bgUrl={sections[3].bg} />

      {/* Persistent UI Elements */}
      <ChatbotWidget />

      {/* Global Overlay Render */}
      <GlassOverlay isOpen={!!overlayContent} onClose={closeOverlay}>
        {overlayContent}
      </GlassOverlay>
    </div>
  );
};
