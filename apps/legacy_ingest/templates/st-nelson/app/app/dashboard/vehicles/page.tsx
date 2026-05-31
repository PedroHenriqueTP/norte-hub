import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Plus, Search, Filter, Car } from "lucide-react"

export default async function VehiclesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // RLS will filter automatically for us, but we need to select from the table.
    // Note: We need to ensure we join organization to be safe, or RLS handles it.
    // Our RLS: "Tenants see all their vehicles" using owner_id check on organization.

    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Veículos</h1>
                    <p className="text-zinc-500 mt-1">Gerencie seu estoque completo.</p>
                </div>
                <Link
                    href="/app/dashboard/vehicles/new"
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-md hover:shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Adicionar Veículo
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        placeholder="Buscar por marca, modelo ou placa..."
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-red-500 transition-colors placeholder:text-zinc-400 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles && vehicles.length > 0 ? (
                    vehicles.map((car: any) => (
                        <div key={car.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-all group">
                            <div className="aspect-video bg-zinc-100 relative flex items-center justify-center">
                                {/* Placeholder for Image */}
                                <Car className="w-10 h-10 text-zinc-300" />

                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium border ${car.status === 'disponivel' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                        car.status === 'vendido' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' :
                                            'bg-amber-50 text-amber-600 border-amber-200'
                                        }`}>
                                        {car.status === 'disponivel' ? 'Disponível' : car.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-zinc-900 truncate">{car.brand} {car.model}</h3>
                                </div>
                                <p className="text-zinc-500 text-xs mb-4">{car.version} • {car.year_model}</p>

                                <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <span className="font-bold text-lg text-zinc-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price_sell)}
                                    </span>
                                    <button className="text-xs text-zinc-400 hover:text-red-600 transition-colors">Editar</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-medium text-zinc-900">Nenhum veículo encontrado</h3>
                        <p className="text-zinc-500 mb-6">Comece adicionando seu primeiro carro ao estoque.</p>
                        <Link
                            href="/app/dashboard/vehicles/new"
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                            Adicionar agora →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
