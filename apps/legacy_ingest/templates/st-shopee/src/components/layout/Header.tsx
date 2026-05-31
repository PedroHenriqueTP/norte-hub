import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-background/80 backdrop-blur-md">
            <Container>
                <div className="flex h-20 items-center justify-between">
                    {/* Mobile Menu */}
                    <button className="lg:hidden p-2 -ml-2 text-stone-600">
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <h1 className="font-serif text-2xl font-bold tracking-tight text-primary">
                            Natural Life<span className="text-secondary">.</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/catalogo" className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                            Todos
                        </Link>
                        <Link href="/catalogo?category=Utilitários" className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                            Utilitários
                        </Link>
                        <Link href="/catalogo?category=Roupas" className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                            Roupas
                        </Link>
                        <Link href="/catalogo?category=Casa" className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                            Casa
                        </Link>
                        <Link href="/catalogo?category=Naturais" className="text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                            Naturais
                        </Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-stone-600 hover:text-primary transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="relative p-2 text-stone-600 hover:text-primary transition-colors">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </Container>
        </header>
    );
}
