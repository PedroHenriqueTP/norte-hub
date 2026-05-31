import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";
import { products } from "@/data/products";

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />

      <main className="flex-1 bg-background">
        <section className="py-24">
          <Container>
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
                Destaques da Semana
              </h2>
              <p className="text-stone-500 max-w-2xl">
                Peças selecionadas que trazem o equilíbrio perfeito entre funcionalidade e estética natural.
              </p>
            </div>
            <ProductGrid products={featuredProducts} />
          </Container>
        </section>

        <section className="py-24 bg-stone-100">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1595166946322-19e075908f56?q=80&w=2070&auto=format&fit=crop"
                  alt="Our Philosophy"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="space-y-6">
                <span className="text-primary font-medium tracking-wide text-sm uppercase">Nossa Filosofia</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
                  Feito para durar, <br />pensado para viver.
                </h2>
                <p className="text-stone-600 leading-relaxed">
                  Acreditamos que os objetos que nos cercam influenciam diretamente nosso bem-estar.
                  Por isso, priorizamos materiais naturais, processos éticos e design atemporal.
                  Cada peça em nossa loja conta uma história de cuidado e simplicidade.
                </p>
                <a href="/sobre" className="inline-block text-primary font-medium hover:text-secondary underline underline-offset-4 transition-colors">
                  Conheça nossa história
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
