import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, BarChart3, Globe, Zap, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Globe className="h-6 w-6 text-indigo-600" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">OmniSync</span>
                    </div>
                    <nav className="hidden gap-6 md:flex">
                        <Link href="#features" className="text-sm font-medium hover:text-indigo-600">Funcionalidades</Link>
                        <Link href="#pricing" className="text-sm font-medium hover:text-indigo-600">Preços</Link>
                        <Link href="#faq" className="text-sm font-medium hover:text-indigo-600">FAQ</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="hidden sm:inline-flex">Entrar</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">Começar Grátis</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Centralize seus Marketplaces em <span className="text-indigo-600">Um Só Lugar</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                            Gerencie estoque, pedidos e produtos do Mercado Livre, Shopee e Amazon em uma única plataforma. Evite furos de estoque e venda mais.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="h-12 bg-indigo-600 px-8 text-lg font-medium hover:bg-indigo-700">
                                    Começar Grátis <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="#">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-medium">
                                    Ver Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="border-y border-slate-200 bg-white py-12">
                    <div className="container mx-auto px-4 text-center">
                        <p className="mb-8 text-sm font-medium uppercase tracking-wider text-slate-500">
                            Confiado por lojistas que vendem no
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:gap-16">
                            {/* Placeholders for logos (using text or simple SVG shapes if no assets) */}
                            <div className="flex items-center gap-2 text-xl font-bold"><span className="text-yellow-500">Mercado</span><span className="text-blue-900">Livre</span></div>
                            <div className="flex items-center gap-2 text-xl font-bold"><span className="text-orange-500">Shopee</span></div>
                            <div className="flex items-center gap-2 text-xl font-bold">Amazon</div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Tudo que você precisa para escalar</h2>
                            <p className="mt-4 text-lg text-slate-600">Ferramentas poderosas para simplificar sua operação.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <Zap className="h-10 w-10 text-indigo-600 mb-2" />
                                    <CardTitle>Sincronização em Tempo Real</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Atualize o estoque em todos os canais instantaneamente assim que uma venda acontece.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <Shield className="h-10 w-10 text-indigo-600 mb-2" />
                                    <CardTitle>Gestão Centralizada</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Controle todos os seus produtos e anúncios de uma única tela. Chega de abrir múltiplas abas.</p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <BarChart3 className="h-10 w-10 text-indigo-600 mb-2" />
                                    <CardTitle>Analytics Unificado</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">Visualize relatórios de vendas consolidados e entenda qual canal traz mais lucro.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Planos para todos os tamanhos</h2>
                            <p className="mt-4 text-lg text-slate-600">Comece grátis e cresça conosco.</p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Starter */}
                            <Card className="flex flex-col border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Starter</CardTitle>
                                    <CardDescription>Para quem está começando</CardDescription>
                                    <div className="pt-4 text-4xl font-bold">Grátis</div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3 text-sm text-slate-600">
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Até 50 pedidos/mês</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> 1 Marketplace</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Atualização diária</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline">Começar agora</Button>
                                </CardFooter>
                            </Card>

                            {/* Pro */}
                            <Card className="flex flex-col border-indigo-600 shadow-lg relative scale-105 z-10">
                                <div className="absolute top-0 right-0 -mr-1 -mt-1 rounded-bl-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white uppercase">Popular</div>
                                <CardHeader>
                                    <CardTitle className="text-xl text-indigo-600">Pro</CardTitle>
                                    <CardDescription>Para vendedores em crescimento</CardDescription>
                                    <div className="pt-4 text-4xl font-bold">R$ 97<span className="text-lg font-normal text-slate-500">/mês</span></div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3 text-sm text-slate-600">
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Pedidos ilimitados</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Até 3 Marketplaces</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Sincronização em tempo real</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Suporte prioritário</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/register" className="w-full">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Testar Grátis por 7 dias</Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            {/* Enterprise */}
                            <Card className="flex flex-col border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Enterprise</CardTitle>
                                    <CardDescription>Para grandes operações</CardDescription>
                                    <div className="pt-4 text-4xl font-bold">Sob Consulta</div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3 text-sm text-slate-600">
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Múltiplos usuários</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Marketplaces ilimitados</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> API dedicada</li>
                                        <li className="flex gap-2"><Check className="h-5 w-5 text-indigo-600" /> Gerente de conta</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline">Falar com Vendas</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Perguntas Frequentes</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Como funciona a sincronização?</AccordionTrigger>
                                <AccordionContent>
                                    O OmniSync monitora suas vendas em cada canal. Quando um pedido é feito (ex: no Mercado Livre), nós automaticamente descontamos o estoque na Shopee e Amazon em questão de segundos.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Posso testar antes de assinar?</AccordionTrigger>
                                <AccordionContent>
                                    Sim! oferecemos um plano Grátis para sempre (Starter) e um período de teste de 7 dias para o plano Pro, sem compromisso.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>É seguro conectar minhas contas?</AccordionTrigger>
                                <AccordionContent>
                                    Absolutamente. Utilizamos criptografia de ponta a ponta e armazenamos suas credenciais de forma segura (AES-256). Nunca compartilhamos seus dados com terceiros.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-indigo-600" />
                        <span className="font-semibold text-slate-900">OmniSync</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2024 OmniSync Retail Hub. Todos os direitos reservados.</p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <Link href="#" className="hover:text-indigo-600">Termos</Link>
                        <Link href="#" className="hover:text-indigo-600">Privacidade</Link>
                        <Link href="#" className="hover:text-indigo-600">Contato</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
