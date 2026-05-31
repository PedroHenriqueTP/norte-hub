"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";

export default function AdminFinancePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Financeiro Admin</h1>
                <Button>Novo Plano</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total (Mês)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 45.231,89</div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 189,90</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pagamentos Falhos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground text-red-500">Ação requerida</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                    <CardDescription>Histórico de pagamentos da plataforma.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Plano</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[
                                { id: "TRX-9821", user: "Dr. Silva", plan: "Pro Anual", val: "R$ 1990,00", status: "success", date: "14/01/2026" },
                                { id: "TRX-9820", user: "Dra. Santos", plan: "Básico Mensal", val: "R$ 89,90", status: "success", date: "14/01/2026" },
                                { id: "TRX-9819", user: "Clínica Vida", plan: "Enterprise", val: "R$ 459,90", status: "pending", date: "13/01/2026" },
                                { id: "TRX-9818", user: "Dr. House", plan: "Pro Mensal", val: "R$ 199,90", status: "failed", date: "13/01/2026" },
                            ].map((trx, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono text-xs">{trx.id}</TableCell>
                                    <TableCell>{trx.user}</TableCell>
                                    <TableCell>{trx.plan}</TableCell>
                                    <TableCell>{trx.val}</TableCell>
                                    <TableCell>
                                        <Badge variant={trx.status === 'success' ? 'default' : trx.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {trx.status === 'success' ? 'Aprovado' : trx.status === 'pending' ? 'Pendente' : 'Falhou'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{trx.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
