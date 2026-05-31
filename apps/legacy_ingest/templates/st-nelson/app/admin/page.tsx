import { createClient } from "@/lib/supabase/server"
import { Building2, Users, Car, TrendingUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminPage() {
    const supabase = await createClient()

    // Check if user is super admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/app/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_super_admin) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-zinc-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
                    <p className="text-zinc-500 mb-6">Você não tem permissão para acessar esta área.</p>
                    <Link href="/app/dashboard" className="text-red-600 hover:underline">Voltar para Dashboard</Link>
                </div>
            </div>
        )
    }

    // Fetch Metrics
    const { count: orgCount } = await supabase.from('organizations').select('*', { count: 'exact', head: true })
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: vehicleCount } = await supabase.from('vehicles').select('*', { count: 'exact', head: true })

    // Fetch Recent Organizations
    const { data: recentOrgs } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-zinc-900">
            {/* Navbar */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-red-600" />
                        <span className="font-bold text-lg tracking-tight">AutoShop Admin</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">{user.email}</span>
                        <Link href="/app/dashboard" className="text-sm font-medium hover:text-red-600 transition-colors">
                            Ver Dashboard de Tenant
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900">Visão Geral do SaaS</h1>
                    <p className="text-zinc-500">Acompanhe o crescimento e métricas da plataforma.</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Total de Lojas</p>
                            <h3 className="text-2xl font-bold text-zinc-900">{orgCount || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Usuários Totais</p>
                            <h3 className="text-2xl font-bold text-zinc-900">{userCount || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-500">Veículos Cadastrados</p>
                            <h3 className="text-2xl font-bold text-zinc-900">{vehicleCount || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Recent Signups */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center">
                        <h3 className="font-bold text-zinc-900">Lojas Recentes</h3>
                        <button className="text-sm text-red-600 font-medium hover:underline">Ver todas</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 text-zinc-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Nome da Loja</th>
                                    <th className="px-6 py-3">Slug</th>
                                    <th className="px-6 py-3">Data de Cadastro</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {recentOrgs && recentOrgs.length > 0 ? (
                                    recentOrgs.map((org: any) => (
                                        <tr key={org.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-900">{org.name}</td>
                                            <td className="px-6 py-4 text-zinc-500">{org.slug}</td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                {new Date(org.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Ativo
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                            Nenhuma loja encontrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
