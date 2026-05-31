import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Hero } from "@/components/landing/Hero";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Workflow } from "@/components/landing/Workflow";

import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      <LandingNavbar user={user} />

      <main className="space-y-0">
        <Hero />

        <div id="features">
          <FeaturesBento />
        </div>

        {/* Interactive Workflow Section */}
        <Workflow />

        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

