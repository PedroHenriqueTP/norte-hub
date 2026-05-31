import Link from "next/link"
import { Car, ArrowRight, Shield, Zap, Smartphone } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 selection:bg-red-500/20 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-600 rounded-lg shadow-md shadow-red-600/20">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-xl text-zinc-900">AutoShop SaaS</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/app/login" className="text-sm font-medium text-zinc-600 hover:text-red-600 transition-colors">Entrar</Link>
                        <Link href="/app/register" className="text-sm font-medium bg-zinc-900 text-white px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Começar Agora
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                {/* Background Decor - Subtle Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-gray-50 to-white -z-10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-red-50 rounded-full blur-3xl -z-10 opacity-40"></div>

                <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in pt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-600 tracking-wide uppercase">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Nova Versão 2.0 Disponível
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                        A plataforma definitiva para <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-500">
                            vender veículos premium.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto leading-relaxed font-light">
                        Tenha seu próprio site de vendas, painel de gestão financeira e controle de estoque em minutos. Design de elite para lojas exigentes.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/app/register" className="h-14 px-10 rounded-full bg-red-600 hover:bg-red-500 text-white text-lg font-semibold flex items-center gap-3 transition-all shadow-xl shadow-red-600/20 hover:shadow-2xl hover:shadow-red-600/40 hover:-translate-y-1">
                            Criar Minha Loja Grátis <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="h-14 px-10 rounded-full bg-white text-zinc-700 border border-zinc-200 font-semibold flex items-center gap-3 transition-all hover:border-zinc-300 hover:bg-gray-50 hover:text-zinc-900 shadow-sm hover:shadow-md">
                            Ver Demonstração
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview (Abstract) */}
                <div className="mt-24 max-w-6xl mx-auto relative group">
                    <div className="absolute -inset-4 bg-gradient-to-t from-zinc-200 to-transparent rounded-3xl blur-2xl opacity-40 -z-10"></div>
                    <div className="relative aspect-[16/9] bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden flex items-center justify-center group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                        {/* Placeholder for Product Image */}
                        <div className="text-center space-y-4">
                            <div className="w-24 h-24 bg-zinc-100 rounded-2xl mx-auto flex items-center justify-center">
                                <Car className="w-10 h-10 text-zinc-300" />
                            </div>
                            <span className="text-zinc-400 font-medium text-sm tracking-widest uppercase block">[ Dashboard Interface Preview ]</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 bg-gray-50 border-t border-zinc-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Tudo o que você precisa</h2>
                        <p className="text-lg text-zinc-500">Desenvolvido pensando em lojas de veículos que precisam de velocidade, segurança e beleza.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6" />}
                            title="Mobile First Real"
                            description="Seu site funciona perfeitamente em qualquer dispositivo. O painel administrativo é 100% responsivo."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Performance Extrema"
                            description="Carregamento instantâneo. Seus clientes não gostam de esperar, e o Google também não."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Segurança Bancária"
                            description="Seus dados e de seus clientes protegidos com criptografia de ponta a ponta e backups diários."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-white border-t border-zinc-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
                    <Car className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-zinc-900">AutoShop SaaS</span>
                </div>
                <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} AutoShop SaaS Protocol. Todos os direitos reservados.</p>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white border border-zinc-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-red-600 transition-colors">{title}</h3>
            <p className="text-zinc-500 leading-relaxed max-w-sm">{description}</p>
        </div>
    )
}
