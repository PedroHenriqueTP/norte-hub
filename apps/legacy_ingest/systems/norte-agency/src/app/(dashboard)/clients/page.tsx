import { getAuthContext } from "@/services/auth-context";
import { ClientService } from "@/services/client.service";
import { Button } from "@/components/ui/button";
import { Plus, Search, Building, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function ClientsPage() {
    const { tenantId } = await getAuthContext();
    const clients = await ClientService.with(tenantId).getAll();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clientes</h1>
                    <p className="text-slate-500">Gerencie sua carteira de clientes.</p>
                </div>
                <Link href="/clients/new">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Novo Cliente
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar clientes..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                    </div>
                </div>

                {clients.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        <p>Nenhum cliente cadastrado ainda.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Nome / Empresa</th>
                                <th className="px-6 py-3">Contatos</th>
                                <th className="px-6 py-3">Jobs</th>
                                <th className="px-6 py-3">Cadastrado em</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Building size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{client.name}</p>
                                                {client.document && <p className="text-xs text-slate-500">{client.document}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {client.email && (
                                            <div className="flex items-center gap-1">
                                                <Mail size={14} /> {client.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded-md font-medium text-xs">
                                            {client._count.jobs} jobs
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {format(client.createdAt, 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-violet-600">
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
