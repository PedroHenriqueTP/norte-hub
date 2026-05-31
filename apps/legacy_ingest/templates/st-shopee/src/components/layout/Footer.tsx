import { Container } from '@/components/ui/Container';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-stone-50 pt-16 pb-8 border-t border-stone-100">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-serif text-xl font-bold text-primary mb-4">
                            Natural Life.
                        </h3>
                        <p className="text-stone-500 text-sm leading-relaxed max-w-xs mb-6">
                            Curadoria de produtos essenciais para um estilo de vida mais simples,
                            orgânico e conectado com a natureza.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-stone-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-stone-400 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-stone-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-900 mb-4">Loja</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Todos os Produtos</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Lançamentos</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Mais Vendidos</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Móveis</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-stone-900 mb-4">Ajuda</h4>
                        <ul className="space-y-3 text-sm text-stone-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Envios e Devoluções</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
                    <p>© 2024 Natural Life and House. Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <span>Feito com ❤️ por Antigravity</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
