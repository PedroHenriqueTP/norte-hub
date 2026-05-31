import { FileText, Download, Send, Plus, Search, Filter } from "lucide-react"

export default function InvoicesPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Notas Fiscais</h1>
                    <p className="text-zinc-500 mt-1">Emissão e gestão de documentos fiscais (NFe / NFS-e).</p>
                </div>
                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-md flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Emitir Nova Nota
                </button>
            </div>

            {/* Integration Status */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <Send className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold text-blue-900">Emissor Configurado</p>
                        <p className="text-xs text-blue-700">Conectado à Prefeitura de São Paulo (Ambiente de Produção)</p>
                    </div>
                </div>
                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded">Ativo</span>
            </div>

            {/* Filters */}
            <div className="bg-white border border-zinc-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                        placeholder="Buscar por cliente, CPF/CNPJ ou número da nota..."
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-red-500 transition-colors placeholder:text-zinc-400 focus:ring-1 focus:ring-red-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtrar
                </button>
            </div>

            {/* Invoices List */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4">Número</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Emissão</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                        {[
                            { num: '00124', client: 'João Silva', val: 'R$ 125.000,00', status: 'issued', date: 'Hoje, 10:45' },
                            { num: '00123', client: 'Maria Oliveira', val: 'R$ 89.900,00', status: 'issued', date: '08/02/2026' },
                            { num: '00122', client: 'Pedro Santos', val: 'R$ 45.000,00', status: 'cancelled', date: '05/02/2026' },
                            { num: '00121', client: 'Ana Costa', val: 'R$ 110.000,00', status: 'processing', date: '05/02/2026' },
                        ].map((invoice, i) => (
                            <tr key={i} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-zinc-900">#{invoice.num}</td>
                                <td className="px-6 py-4 text-zinc-600">{invoice.client}</td>
                                <td className="px-6 py-4 font-medium text-zinc-900">{invoice.val}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-6 py-4 text-zinc-500">{invoice.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-red-600 hover:text-red-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto">
                                        <Download className="w-4 h-4" /> PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        issued: "bg-emerald-100 text-emerald-800",
        cancelled: "bg-red-100 text-red-800",
        processing: "bg-yellow-100 text-yellow-800",
    }
    const labels = {
        issued: "Emitida",
        cancelled: "Cancelada",
        processing: "Processando",
    }
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels]}
        </span>
    )
}
