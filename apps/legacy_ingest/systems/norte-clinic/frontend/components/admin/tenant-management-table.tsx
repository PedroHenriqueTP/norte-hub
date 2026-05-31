"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export function TenantManagementTable({ tenants }: { tenants: any[] }) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[200px]">Clínica / Tenant</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Faturamento (MRR)</TableHead>
                        <TableHead>Uso de Armazenamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-medium text-slate-700">
                                <div>{tenant.name}</div>
                                <div className="text-xs text-slate-400 font-mono">{tenant.id}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={tenant.plan === 'Enterprise' ? 'default' : 'secondary'}>
                                    {tenant.plan}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${tenant.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="text-sm text-slate-600">{tenant.isActive ? 'Ativo' : 'Inadimplente'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-slate-600">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tenant.mrr)}
                            </TableCell>
                            <TableCell className="w-[200px]">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[10px] uppercase text-slate-400">
                                        <span>{tenant.storageUsed}MB / {tenant.storageLimit}MB</span>
                                    </div>
                                    <Progress value={(tenant.storageUsed / tenant.storageLimit) * 100} className="h-1" />
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <button className="text-xs text-blue-600 hover:underline font-semibold">
                                    Gerenciar
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
