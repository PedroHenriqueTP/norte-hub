import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import About from './components/About';
import ProductGrid from './components/ProductGrid';
import SocialProof from './components/SocialProof';
import LocationContact from './components/LocationContact';
import Footer from './components/Footer';

function App() {
  return (
    <main className="w-full min-h-screen bg-bakery-50 antialiased font-sans text-bakery-900 selection:bg-bakery-200 selection:text-bakery-900">
      <Navbar />
      <HeroSection />
      <About />
      <ProductGrid />
      <SocialProof />
      <LocationContact />
      <Footer />
    </main>
  );
}

export default App;
