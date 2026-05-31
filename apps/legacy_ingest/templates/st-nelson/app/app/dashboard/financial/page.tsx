import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText, Plus } from "lucide-react"

export default function FinancialPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Financeiro</h1>
                    <p className="text-zinc-500 mt-1">Controle de caixa, despesas e lucratividade.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-medium hover:bg-zinc-50 transition-colors shadow-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Relatórios
                    </button>
                    <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nova Transação
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+8.2%</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">Receitas (Mês)</p>
                    <h3 className="text-3xl font-bold text-zinc-900">R$ 128.400</h3>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">+2.4%</span>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">Despesas (Mês)</p>
                    <h3 className="text-3xl font-bold text-zinc-900">R$ 42.150</h3>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">Saldo em Caixa</p>
                    <h3 className="text-3xl font-bold text-zinc-900">R$ 86.250</h3>
                </div>
            </div>

            {/* Transactions & Cash Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions List */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-zinc-900">Últimos Lançamentos</h3>
                        <button className="text-sm text-red-600 font-medium hover:underline">Ver todos</button>
                    </div>
                    <div className="divide-y divide-zinc-100">
                        <TransactionItem
                            title="Venda - Toyota Corolla"
                            date="Hoje, 10:42"
                            amount="R$ 125.000,00"
                            type="income"
                            category="Venda de Veículo"
                        />
                        <TransactionItem
                            title="Pagamento Aluguel"
                            date="Ontem, 09:15"
                            amount="- R$ 4.500,00"
                            type="expense"
                            category="Custos Fixos"
                        />
                        <TransactionItem
                            title="Comissão Vendedor (João)"
                            date="Ontem, 16:30"
                            amount="- R$ 2.500,00"
                            type="expense"
                            category="Comissões"
                        />
                        <TransactionItem
                            title="Venda - Honda Civic"
                            date="08/02/2026"
                            amount="R$ 98.000,00"
                            type="income"
                            category="Venda de Veículo"
                        />
                        <TransactionItem
                            title="Manutenção Pátio"
                            date="07/02/2026"
                            amount="- R$ 850,00"
                            type="expense"
                            category="Manutenção"
                        />
                    </div>
                </div>

                {/* Profitability / Actions */}
                <div className="space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Resumo Financeiro</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Mês Atual</span>
                                <span className="font-medium text-zinc-900">Fevereiro 2026</span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Meta: R$ 150k</span>
                                <span>85% Atingido</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500">Lucro Bruto</p>
                                <p className="font-bold text-emerald-600">32%</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500">Custo Médio</p>
                                <p className="font-bold text-red-600">R$ 12k</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 text-white rounded-xl p-6 shadow-lg shadow-zinc-900/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-zinc-800 rounded-lg">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Emissão de Notas</h3>
                        </div>
                        <p className="text-zinc-400 text-sm mb-6">
                            Emita notas fiscais de serviço (NFS-e) e produto (NFe) diretamente pelo sistema.
                        </p>
                        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Configurar Em emissor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TransactionItem({ title, date, amount, type, category }: { title: string, date: string, amount: string, type: 'income' | 'expense', category: string }) {
    return (
        <div className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                    <h4 className="font-medium text-zinc-900">{title}</h4>
                    <p className="text-xs text-zinc-500">{date} • {category}</p>
                </div>
            </div>
            <span className={`font-bold ${type === 'income' ? 'text-emerald-600' : 'text-zinc-900'}`}>{amount}</span>
        </div>
    )
}
