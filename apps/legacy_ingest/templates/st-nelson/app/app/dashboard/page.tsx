import { Suspense, type ReactNode } from "react"
import { DollarSign, Car, TrendingUp, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Carregando...</div>
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single()

    const isSuperAdmin = profile?.is_super_admin

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
                    {isSuperAdmin ? 'Painel Administrativo' : 'Painel de Controle'}
                </h1>
                <p className="text-zinc-500 mt-1">
                    {isSuperAdmin
                        ? 'Visão geral de todo o ecossistema AutoShop.'
                        : 'Bem-vindo de volta. Aqui está o resumo da sua loja hoje.'}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isSuperAdmin ? (
                    <>
                        <StatCard
                            title="Receita Recorrente (MRR)"
                            value="R$ 450.000"
                            change="+15% esse mês"
                            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                        />
                        <StatCard
                            title="Total de Lojas"
                            value="120"
                            change="8 novas essa semana"
                            icon={<Users className="w-5 h-5 text-blue-600" />}
                        />
                        <StatCard
                            title="Usuários Ativos"
                            value="3,450"
                            change="+120 hoje"
                            icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                        />
                        <StatCard
                            title="Churn Rate"
                            value="0.8%"
                            change="-0.2% comparado a ontem"
                            icon={<Users className="w-5 h-5 text-red-600" />}
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Vendas Totais"
                            value="R$ 145.000"
                            change="+12% esse mês"
                            icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
                        />
                        <StatCard
                            title="Veículos Ativos"
                            value="24"
                            change="3 novos essa semana"
                            icon={<Car className="w-5 h-5 text-blue-600" />}
                        />
                        <StatCard
                            title="Leads Hoje"
                            value="12"
                            change="+4 comparado a ontem"
                            icon={<Users className="w-5 h-5 text-purple-600" />}
                        />
                        <StatCard
                            title="Lucro Estimado"
                            value="R$ 32.500"
                            change="Margem de 22%"
                            icon={<TrendingUp className="w-5 h-5 text-red-600" />}
                        />
                    </>
                )}
            </div>

            {/* Recent Activity / Quick Actions Placeholder */}
            {isSuperAdmin ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 min-h-[300px] shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Crescimento de Tenants</h3>
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 border border-dashed border-zinc-200 rounded-lg">
                            Gráfico de Novos Clientes (Admin)
                        </div>
                    </div>
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Gestão SaaS</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 transition-colors flex items-center justify-between group">
                                Gerenciar Planos
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 transition-colors flex items-center justify-between group">
                                Ver Logs de Sistema
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 min-h-[300px] shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Desempenho de Vendas</h3>
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 border border-dashed border-zinc-200 rounded-lg">
                            Gráfico de Vendas (Em breve)
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Ações Rápidas</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 transition-colors flex items-center justify-between group">
                                Adicionar Novo Veículo
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 transition-colors flex items-center justify-between group">
                                Ver Leads Recentes
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-600 transition-colors flex items-center justify-between group">
                                Configurar Site
                                <span className="text-red-600 group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: ReactNode }) {
    return (
        <div className="bg-white border border-zinc-200 p-6 rounded-xl hover:border-red-100 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-zinc-500">{title}</p>
                <h3 className="text-2xl font-bold text-zinc-900 mt-1">{value}</h3>
                <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
                    <span className="text-emerald-600">↑</span> {change}
                </p>
            </div>
        </div>
    )
}
