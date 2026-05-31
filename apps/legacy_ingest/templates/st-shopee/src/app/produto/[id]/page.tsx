import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Truck, ShieldCheck } from "lucide-react";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    const product = products.find((p) => p.id === resolvedParams.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-background py-12">
                <Container>
                    <Link
                        href="/catalogo"
                        className="inline-flex items-center text-sm text-stone-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o catálogo
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        {/* Image Section */}
                        <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-stone-100">
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col justify-center">
                            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
                                {product.category}
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                                {product.title}
                            </h1>
                            <p className="text-2xl font-medium text-stone-900 mb-8">
                                R$ {product.price.toFixed(2).replace('.', ',')}
                            </p>

                            <div className="prose prose-stone mb-10 text-stone-600 leading-relaxed">
                                <p>{product.shortDescription}</p>
                                <p>
                                    Feito com materiais selecionados para garantir durabilidade e conforto.
                                    Ideal para quem busca um estilo de vida mais natural e conectado com o essencial.
                                </p>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center text-sm text-stone-600">
                                    <Check className="h-5 w-5 text-green-600 mr-3" />
                                    <span>Em estoque - Envio imediato</span>
                                </div>
                                <div className="flex items-center text-sm text-stone-600">
                                    <Truck className="h-5 w-5 text-stone-400 mr-3" />
                                    <span>Frete grátis para compras acima de R$ 299</span>
                                </div>
                                <div className="flex items-center text-sm text-stone-600">
                                    <ShieldCheck className="h-5 w-5 text-stone-400 mr-3" />
                                    <span>Garantia de 30 dias para devolução</span>
                                </div>
                            </div>

                            <Button size="lg" className="w-full md:w-auto text-lg py-6" disabled={!product.inStock}>
                                {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                            </Button>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
