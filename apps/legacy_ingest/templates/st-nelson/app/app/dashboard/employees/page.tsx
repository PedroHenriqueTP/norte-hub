import { Users, UserPlus, Shield, TrendingUp, Mail } from "lucide-react"

export default function EmployeesPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Equipe</h1>
                    <p className="text-zinc-500 mt-1">Gerencie vendedores, gerentes e permissões.</p>
                </div>
                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Novo Colaborador
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Carlos Silva', role: 'Gerente Geral', email: 'carlos@loja.com', sales: 12, type: 'admin' },
                    { name: 'Ana Souza', role: 'Vendedora Senior', email: 'ana@loja.com', sales: 28, type: 'seller' },
                    { name: 'Pedro Santos', role: 'Vendedor', email: 'pedro@loja.com', sales: 8, type: 'seller' },
                ].map((emp, i) => (
                    <div key={i} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-red-200 transition-colors group">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-600 text-lg">
                                    {emp.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900">{emp.name}</h3>
                                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {emp.email}
                                    </p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.type === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                {emp.role}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm p-3 bg-zinc-50 rounded-lg">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    Vendas Mês
                                </div>
                                <span className="font-bold text-zinc-900">{emp.sales} carros</span>
                            </div>

                            <div className="flex items-center justify-between text-sm p-3 bg-zinc-50 rounded-lg">
                                <div className="flex items-center gap-2 text-zinc-600">
                                    <Shield className="w-4 h-4 text-zinc-400" />
                                    Acesso
                                </div>
                                <span className="text-zinc-900">{emp.type === 'admin' ? 'Total' : 'Restrito'}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                                Editar
                            </button>
                            <button className="flex-1 py-2 text-sm font-medium text-red-600 hover:text-white border border-red-200 rounded-lg hover:bg-red-600 transition-colors">
                                Desativar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
