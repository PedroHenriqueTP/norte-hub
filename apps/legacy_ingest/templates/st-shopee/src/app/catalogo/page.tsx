import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Container } from "@/components/ui/Container";
import { products } from "@/data/products";
import { Category } from "@/types";
import Link from "next/link";

interface CatalogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
    const resolvedSearchParams = await searchParams;
    const category = resolvedSearchParams.category as Category | undefined;

    const filteredProducts = category
        ? products.filter(p => p.category === category)
        : products;

    const categories: Category[] = ['Utilitários', 'Roupas', 'Casa', 'Naturais'];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-background py-12">
                <Container>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <h1 className="font-serif text-3xl font-bold text-primary mb-4 md:mb-0">
                            {category ? category : 'Todos os Produtos'}
                        </h1>

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            <Link href="/catalogo">
                                <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${!category ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                                    Todos
                                </button>
                            </Link>
                            {categories.map((cat) => (
                                <Link key={cat} href={`/catalogo?category=${cat}`}>
                                    <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                    ${category === cat ? 'bg-primary text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                                        {cat}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <ProductGrid products={filteredProducts} />
                    ) : (
                        <div className="py-20 text-center text-stone-500">
                            <p>Nenhum produto encontrado nesta categoria.</p>
                        </div>
                    )}
                </Container>
            </main>
            <Footer />
        </div>
    );
}
