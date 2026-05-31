import { DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function SaaSFinancialPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Financeiro SaaS</h1>
                <p className="text-zinc-500 mt-1">Visão global da receita recorrente da plataforma (MRR).</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">MRR Total</p>
                    <h3 className="text-3xl font-bold text-zinc-900">R$ 45.280</h3>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+8 assinaturas</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">Assinaturas Ativas</p>
                    <h3 className="text-3xl font-bold text-zinc-900">142</h3>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">LTV Médio</p>
                    <h3 className="text-3xl font-bold text-zinc-900">R$ 1.250</h3>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-zinc-900 mb-6">Transações Recentes</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-zinc-900">Pagamento de Assinatura (Pro)</p>
                                    <p className="text-xs text-zinc-500">Loja Prime Motors • ID: #TRX-{9000 + item}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-emerald-600">+ R$ 299,00</p>
                                <p className="text-xs text-zinc-400">Hoje, 14:30</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
