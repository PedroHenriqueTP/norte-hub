import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Culture from "./components/Culture";
import SocialProof from "./components/SocialProof";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Hero />
      <Portfolio />
      <SocialProof />
      <Services />
      <Culture />
      <Footer />
    </main>
  );
}
