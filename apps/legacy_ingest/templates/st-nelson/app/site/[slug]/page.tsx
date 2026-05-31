import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Car, Instagram, MessageCircle, Phone, MapPin, Clock, ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"

interface StorePageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function StorePage({ params }: StorePageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug, site_config(*), vehicles(*)')
        .eq('slug', slug)
        .single()

    if (!org) {
        return notFound()
    }

    const siteConfigData = Array.isArray(org.site_config) ? org.site_config[0] : org.site_config
    const config = siteConfigData || {
        primary_color: '#dc2626',
        banner_url: null,
        welcome_message: `Bem-vindo à ${org.name}`
    }

    const primaryColor = config.primary_color || '#dc2626'

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-100 selection:text-red-900 flex flex-col">

            {/* Topbar */}
            <div className="bg-zinc-900 text-zinc-400 py-2.5 px-6 text-xs border-b border-zinc-800">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                            <Phone className="w-3.5 h-3.5" /> (11) 99999-9999
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default hidden sm:flex">
                            <Clock className="w-3.5 h-3.5" /> Seg - Sex: 9h às 18h
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Instagram className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <MessageCircle className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={`/site/${slug}`} className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                            <Car className="w-6 h-6 text-zinc-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight uppercase text-zinc-900 group-hover:opacity-80 transition-opacity">
                            {org.name}
                        </span>
                    </Link>

                    <nav className="hidden md:flex gap-8 font-medium text-sm text-zinc-500">
                        <a href="#inventory" className="hover:text-zinc-900 transition-colors">Estoque</a>
                        <a href="#about" className="hover:text-zinc-900 transition-colors">Sobre</a>
                        <a href="#contact" className="hover:text-zinc-900 transition-colors">Contato</a>
                    </nav>

                    <button
                        className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all hover:shadow-lg hover:shadow-zinc-900/20 active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Falar no WhatsApp
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-zinc-50">
                {config.banner_url ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${config.banner_url})` }}>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-200 to-zinc-300" />
                )}

                <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider uppercase mb-2">
                        Premium Auto Center
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-sm">
                        {config.welcome_message}
                    </h2>
                    <p className="text-zinc-200 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Encontre o carro dos seus sonhos com a garantia e procedência que você merece.
                    </p>
                    <div className="pt-4 flex justify-center gap-4">
                        <a
                            href="#inventory"
                            className="bg-white text-zinc-900 px-8 py-3 rounded-full font-semibold hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Ver Estoque UI <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Inventory Grid */}
            <section id="inventory" className="max-w-7xl mx-auto px-6 py-24 flex-1">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h3 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Veículos Disponíveis</h3>
                        <p className="text-zinc-500">Confira nossa seleção exclusiva de seminovos.</p>
                    </div>
                    <span className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                        {org.vehicles?.length || 0} ofertas
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {org.vehicles && org.vehicles.length > 0 ? (
                        org.vehicles.map((car: any) => (
                            <div key={car.id} className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-300 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                                <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-zinc-300 bg-zinc-50">
                                        <Car className="w-16 h-16 opacity-20" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-zinc-900 shadow-sm uppercase tracking-wide">
                                        {car.year_model}
                                    </div>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h4 className="font-bold text-xl text-zinc-900 mb-1 group-hover:text-red-600 transition-colors">
                                            {car.brand} {car.model}
                                        </h4>
                                        <p className="text-sm text-zinc-500 font-medium">{car.version}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-zinc-500 mb-6 bg-zinc-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{car.year_manufacture}/{car.year_model}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{car.mileage.toLocaleString()} km</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 col-span-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <span className="capitalize">{car.transmission}</span>
                                            <span className="mx-1">•</span>
                                            <span className="capitalize">{car.fuel}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Valor à vista</span>
                                            <span className="text-2xl font-bold text-zinc-900" style={{ color: primaryColor }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price_sell)}
                                            </span>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center">
                            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Car className="w-10 h-10 text-zinc-300" />
                            </div>
                            <h4 className="text-xl font-semibold text-zinc-900 mb-2">Estoque em atualização</h4>
                            <p className="text-zinc-500 max-w-sm mx-auto">
                                Estamos selecionando os melhores veículos para você. Volte em alguns instantes.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-900 text-zinc-400 py-16 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg uppercase tracking-wider">{org.name}</h4>
                        <p className="text-sm leading-relaxed">Referência em veículos seminovos com qualidade e procedência garantida.</p>
                    </div>

                    <div>
                        <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Links Rápidos</h5>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Estoque</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Financiamento</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Venda seu carro</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contato</h5>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-zinc-600 shrink-0" />
                                <span>Av. Brasil, 1500 - Jardins<br />São Paulo - SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-zinc-600 shrink-0" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-5 h-5 text-zinc-600 shrink-0" />
                                <span>contato@autoshop.com.br</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Horário</h5>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span>Segunda a Sexta</span>
                                <span className="text-white">09:00 - 18:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado</span>
                                <span className="text-white">09:00 - 13:00</span>
                            </li>
                            <li className="flex justify-between text-zinc-600">
                                <span>Domingo</span>
                                <span>Fechado</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-zinc-800 text-xs text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; 2024 {org.name}. Todos os direitos reservados.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">
                        Powered by <span className="text-white font-bold">AutoShop</span>
                    </p>
                </div>
            </footer>
        </div>
    )
}
