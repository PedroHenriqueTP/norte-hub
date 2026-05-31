import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Car, Calendar, Gauge, Fuel, Zap, ArrowLeft, MessageCircle, Phone, Share2 } from "lucide-react"
import Link from "next/link"

interface VehicleDetailsProps {
    params: Promise<{
        slug: string
        id: string
    }>
}

export default async function VehicleDetailsPage({ params }: VehicleDetailsProps) {
    const { slug, id } = await params
    const supabase = await createClient()

    const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*, organizations(name, site_config(*))') // Join org to get color/config
        .eq('id', id)
        .single()

    if (!vehicle) {
        return notFound()
    }

    const org = vehicle.organizations as any // Type assertion for MVP
    const color = org.site_config?.primary_color || '#dc2626'

    // Format Helpers
    const formatPrice = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value)

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans pb-20">

            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 mb-0">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={`/${slug}`} className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Voltar para estoque</span>
                    </Link>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
                            <Share2 className="w-5 h-5 text-zinc-600" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero / Gallery Parallax */}
            <div className="relative h-[60vh] bg-zinc-900 overflow-hidden">
                {vehicle.photos && vehicle.photos.length > 0 ? (
                    // In production: Use a Carousel component here
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${vehicle.photos[0]})` }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                        <Car className="w-20 h-20 text-zinc-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <div className="animate-fade-in translate-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-2">
                            {vehicle.brand} {vehicle.model}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-300 font-light">{vehicle.version}</p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-20 relative z-10">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Highlights Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-zinc-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <Highlight icon={<Calendar />} label="Ano" value={`${vehicle.year_manufacture}/${vehicle.year_model}`} />
                            <Highlight icon={<Gauge />} label="KM" value={formatNumber(vehicle.mileage)} />
                            <Highlight icon={<Fuel />} label="Combustível" value={vehicle.fuel_type} />
                            <Highlight icon={<Zap />} label="Câmbio" value={vehicle.transmission} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-zinc-900">Sobre este carro</h2>
                        <p className="text-zinc-600 leading-relaxed text-lg">
                            {vehicle.description || "Nenhuma descrição fornecida para este veículo."}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <DetailRow label="Cor" value={vehicle.color} />
                            <DetailRow label="Final da Placa" value="***" />
                            <DetailRow label="Blindado" value="Não" />
                            <DetailRow label="IPVA Pago" value="Sim" />
                        </div>
                    </div>
                </div>

                {/* Sidebar CTA */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-zinc-100 sticky top-24">
                        <div className="mb-6">
                            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-1">Preço à vista</p>
                            <h2 className="text-4xl font-bold text-zinc-900" style={{ color }}>
                                {formatPrice(vehicle.price_sell)}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            <button
                                className="w-full h-14 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Tenho Tenho Interesse (WhatsApp)
                            </button>
                            <button className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all">
                                <Phone className="w-5 h-5" />
                                Ligar Agora
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-100">
                            <h3 className="font-semibold text-zinc-900 mb-4">Simule seu financiamento</h3>
                            <div className="space-y-3">
                                <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:border-zinc-400 outline-none" placeholder="Seu Nome" />
                                <input className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:border-zinc-400 outline-none" placeholder="Seu Telefone" />
                                <button className="w-full py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 font-medium rounded-lg transition-colors text-sm">
                                    Solicitar Contato
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}

function Highlight({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center text-center gap-2 text-zinc-600">
            <div className="p-3 bg-zinc-50 rounded-full mb-1">
                {icon}
            </div>
            <div>
                <span className="block text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</span>
                <span className="block font-bold text-zinc-900 text-lg">{value}</span>
            </div>
        </div>
    )
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0">
            <span className="text-zinc-500">{label}</span>
            <span className="font-medium text-zinc-900">{value}</span>
        </div>
    )
}
