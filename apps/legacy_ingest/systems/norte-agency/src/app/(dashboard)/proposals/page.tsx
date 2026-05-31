import { getAuthContext } from "@/services/auth-context";
import { ProposalService } from "@/services/proposal.service";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function ProposalsPage() {
    const { tenantId } = await getAuthContext();
    const proposals = await ProposalService.with(tenantId).getAll();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orçamentos</h1>
                    <p className="text-slate-500">Gerencie propostas comerciais.</p>
                </div>
                <Link href="/proposals/new">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Novo Orçamento
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {proposals.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center text-slate-500">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">Nenhum orçamento encontrado</h3>
                        <p className="mb-4">Crie sua primeira proposta comercial para começar.</p>
                        <Link href="/proposals/new">
                            <Button variant="outline">Criar Orçamento</Button>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Número</th>
                                <th className="px-6 py-3">Título</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Validade</th>
                                <th className="px-6 py-3 text-right">Valor Total</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {proposals.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        #{p.number}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {p.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {p.client.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={p.status === 'APPROVED' ? 'default' : 'secondary'} className={
                                            p.status === 'APPROVED' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                                p.status === 'REJECTED' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                                    p.status === 'SENT' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                        'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }>
                                            {p.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {p.validUntil ? format(p.validUntil, 'dd/MM/yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                                        R$ {Number(p.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">Detalhes</Button>
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
