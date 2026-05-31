'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  // Lenis options for "Lando-like" inertia
  const lenisOptions = {
    lerp: 0.1,
    duration: 1.5,
    smoothTouch: true,
    smooth: true,
  };

  // Cast to any to avoid peer dependency type mismatches
  const Lenis = ReactLenis as any;

  return (
    <Lenis root options={lenisOptions}>
      {children}
    </Lenis>
  );
}
