'use client';

import Hero from '@/components/Hero';
import Work from '@/components/Work';
import Services from '@/components/Services';
import HoverRevealSection from '@/components/HoverRevealSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main className="relative z-10 bg-black">
        <Hero />
        <Work />
        <Services />
        <HoverRevealSection />
      </main>
      <Footer />
    </>
  );
}
