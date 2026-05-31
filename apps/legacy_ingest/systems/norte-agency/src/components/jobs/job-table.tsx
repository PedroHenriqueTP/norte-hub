"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobTableProps {
    jobs: any[];
    currentUserRole: string;
}

import { deleteJobAction } from "@/actions/jobs";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function JobTable({ jobs, currentUserRole }: JobTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleDelete = (jobId: string) => {
        if (confirm("Tem certeza que deseja excluir este job? Esta ação não pode ser desfeita.")) {
            startTransition(async () => {
                await deleteJobAction(jobId);
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'QUOTATION_REQUESTED': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'QUOTATION_APPROVED': 'bg-blue-50 text-blue-700 border-blue-200',
            'IN_PROGRESS': 'bg-green-50 text-green-700 border-green-200',
            'COMPLETED': 'bg-slate-100 text-slate-700 border-slate-200',
            'CANCELED': 'bg-red-50 text-red-700 border-red-200',
            'DRAFT': 'bg-slate-50 text-slate-500 border-slate-200',
            'ACTIVE': 'bg-green-50 text-green-700 border-green-200'
        };

        const labels: Record<string, string> = {
            'QUOTATION_REQUESTED': 'Orçamento Pedido',
            'QUOTATION_APPROVED': 'Orçamento Aprovado',
            'IN_PROGRESS': 'Em Produção',
            'COMPLETED': 'Concluído',
            'CANCELED': 'Cancelado',
            'DRAFT': 'Rascunho',
            'ACTIVE': 'Em Andamento'
        };

        return (
            <Badge variant="outline" className={styles[status] || 'bg-slate-50 text-slate-700'}>
                {labels[status] || status}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Nome do Job</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Entrega</TableHead>
                        <TableHead className="text-right">Orçamento</TableHead>
                        <TableHead className="text-right">Faturamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                                Nenhum job encontrado com os filtros atuais.
                            </TableCell>
                        </TableRow>
                    ) : (
                        jobs.map((job) => (
                            <TableRow key={job.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-mono text-xs text-slate-500">
                                    #{job.id.slice(0, 5).toUpperCase()}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">
                                    <Link href={`/jobs/${job.id}`} className="hover:underline hover:text-violet-600 block w-full truncate">
                                        {job.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {job.client.name}
                                </TableCell>
                                <TableCell className="text-slate-500 text-xs">
                                    {format(new Date(job.createdAt), 'dd/MM/yyyy')}
                                </TableCell>
                                <TableCell className="text-slate-500 text-xs">
                                    {job.deadline ? format(new Date(job.deadline), 'dd/MM/yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right font-medium text-slate-700">
                                    {Number(job.budget) > 0 ? formatCurrency(Number(job.budget)) : '-'}
                                </TableCell>
                                <TableCell className="text-right text-slate-500">
                                    {/* Placeholder for invoiced amount, assuming logic needs to be added later or mocked now */}
                                    {/* For now using budget vs 0 as per user request to differentiate */}
                                    -
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(job.status)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/jobs/${job.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-violet-600">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {currentUserRole === 'OWNER' && (
                                            <>
                                                <Link href={`/jobs/${job.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                    disabled={isPending}
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
