"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateJobItemStatusAction } from "@/actions/jobs";
import type { JobItemStatus } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, Package, Truck, User } from "lucide-react";

interface JobItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: any; // Decimal
    status: string;
    requestedBy?: { name: string | null } | null;
    approvedBy?: { name: string | null } | null;
    producedBy?: { name: string | null } | null;
    supplier?: { name: string } | null;
    paymentMethod?: string | null;
    receivedAt?: Date | string | null;
}

interface JobItemsTableProps {
    items: JobItem[];
    currentUserRole: string;
}

export function JobItemsTable({ items, currentUserRole }: JobItemsTableProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleStatusChange = (itemId: string, newStatus: JobItemStatus) => {
        startTransition(async () => {
            try {
                await updateJobItemStatusAction(itemId, newStatus);
                toast.success("Status atualizado com sucesso!");
                router.refresh();
            } catch (error) {
                toast.error("Erro ao atualizar status: " + (error as Error).message);
            }
        });
    };

    const canEditStatus = (currentStatus: string) => {
        // Simple role check based on logic defined in action
        if (currentUserRole === "OWNER") return true;
        if (["DIRECTOR", "SUPERVISOR"].includes(currentUserRole)) return true;
        // Add more granular checks if needed
        return false;
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'BUDGETED':
                return { label: 'Orçado', icon: Circle, className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' };
            case 'APPROVED':
                return { label: 'Aprovado', icon: CheckCircle2, className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' };
            case 'IN_PRODUCTION':
                return { label: 'Produzido', icon: Package, className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' };
            case 'IN_STOCK':
                return { label: 'Estoque', icon: Package, className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' };
            case 'DELIVERED':
                return { label: 'Entregue', icon: Truck, className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' };
            case 'PAID':
                return { label: 'Pago', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' };
            default:
                return { label: status, icon: Circle, className: 'bg-slate-100 text-slate-600' };
        }
    };

    const allowedTransitions: Record<JobItemStatus, JobItemStatus[]> = {
        'BUDGETED': ['APPROVED'],
        'APPROVED': ['IN_PRODUCTION'],
        'IN_PRODUCTION': ['IN_STOCK'],
        'IN_STOCK': ['DELIVERED'],
        'DELIVERED': ['PAID'],
        'PAID': []
    };

    // Owner can jump statuses if needed, but let's stick to flow for now or allow all
    const getAvailableStatuses = (currentStatus: JobItemStatus): JobItemStatus[] => {
        if (currentUserRole === 'OWNER') {
            return ['BUDGETED', 'APPROVED', 'IN_PRODUCTION', 'IN_STOCK', 'DELIVERED', 'PAID'];
        }
        return allowedTransitions[currentStatus] || [];
    };

    return (
        <div className="rounded-md border border-slate-200 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[30%]">Item / Descrição</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Responsáveis</TableHead>
                        <TableHead>Fornecedor / Pagamento</TableHead>
                        <TableHead className="text-right">Valores</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                Nenhum item cadastrado neste job.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const statusInfo = getStatusInfo(item.status);
                            const StatusIcon = statusInfo.icon;
                            const availableNext = getAvailableStatuses(item.status as JobItemStatus);
                            const isEditable = canEditStatus(item.status);

                            return (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{item.description}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            Qtd: {item.quantity}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger disabled={!isEditable || isPending || availableNext.length === 0} className="outline-none">
                                                <Badge variant="outline" className={`gap-1 pr-2 pl-1 cursor-pointer transition-colors ${statusInfo.className}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusInfo.label}
                                                </Badge>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center">
                                                {availableNext.map((status) => {
                                                    const info = getStatusInfo(status);
                                                    return (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => handleStatusChange(item.id, status)}
                                                            className="gap-2 cursor-pointer"
                                                        >
                                                            <info.icon className="w-4 h-4" />
                                                            {info.label}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {item.receivedAt && (
                                            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(item.receivedAt), 'dd/MM')}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 text-xs">
                                            {item.requestedBy && (
                                                <div className="flex items-center gap-1 text-slate-600" title="Solicitado por">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                    Solic.: <span className="font-medium text-slate-900">{item.requestedBy.name}</span>
                                                </div>
                                            )}
                                            {item.approvedBy && (
                                                <div className="flex items-center gap-1 text-slate-600" title="Aprovado por">
                                                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                                    Aprov.: <span className="font-medium text-slate-900">{item.approvedBy.name}</span>
                                                </div>
                                            )}
                                            {item.producedBy && (
                                                <div className="flex items-center gap-1 text-slate-600" title="Produzido por">
                                                    <Package className="w-3 h-3 text-amber-400" />
                                                    Prod.: <span className="font-medium text-slate-900">{item.producedBy.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 text-xs">
                                            <div className="font-medium text-slate-900">
                                                {item.supplier?.name || '-'}
                                            </div>
                                            {item.paymentMethod && (
                                                <div className="text-slate-500">
                                                    Pgto: {item.paymentMethod}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="font-medium text-slate-900">
                                            {formatCurrency(Number(item.unitPrice) * item.quantity)}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {item.quantity} x {formatCurrency(Number(item.unitPrice))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
