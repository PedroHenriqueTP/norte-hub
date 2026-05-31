import { createClient } from "@/lib/supabase/server"
import { Search, Filter, MoreHorizontal, Ban, CheckCircle, ExternalLink } from "lucide-react"

export default async function TenantsPage() {
    const supabase = await createClient()

    // Mock data for now, or fetch from organizations table
    const { data: tenants } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Gestão de Lojas (Tenants)</h1>
                    <p className="text-zinc-500 mt-1">Gerencie todas as lojas registradas na plataforma.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-medium hover:bg-zinc-50 transition-colors shadow-sm">
                        Exportar CSV
                    </button>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md">
                        Adicionar Manualmente
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        placeholder="Buscar por nome da loja, email ou slug..."
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-red-500 transition-colors placeholder:text-zinc-400 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Status
                </button>
            </div>

            {/* Tenants Table */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4">Loja</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Plano</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Criado em</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {tenants && tenants.length > 0 ? (
                                tenants.map((tenant: any) => (
                                    <tr key={tenant.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-500">
                                                    {tenant.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                {tenant.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">{tenant.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                Pro
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500">
                                            {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button title="Suspender" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                <button title="Detalhes" className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                        Nenhuma loja encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
