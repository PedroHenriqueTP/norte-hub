"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, DollarSign, Receipt, FileText } from "lucide-react";
import {
    Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Dados mockados (substitua pela query real)
const mockRevenueMonthly = [
    { month: "Jan", revenue: 4500 },
    { month: "Fev", revenue: 5200 },
    { month: "Mar", revenue: 6100 },
    { month: "Abr", revenue: 5800 },
    { month: "Mai", revenue: 7200 },
    { month: "Jun", revenue: 6800 },
];

const mockPaymentTypes = [
    { name: "PIX", value: 45 },
    { name: "Cartão", value: 30 },
    { name: "Dinheiro", value: 15 },
    { name: "Convênio", value: 10 },
];

const mockReceipts = [
    { id: "REC001", patient: "Maria Silva", date: "14/01/2026", value: 350.00, status: "Pago" },
    { id: "REC002", patient: "João Santos", date: "13/01/2026", value: 180.00, status: "Pendente" },
    // ...
];

// Helper Chart Components since we are not using full shadcn/charts library yet or it's complex to setup in one file
// We will use raw Recharts for simplicity as requested, but wrapped in responsive container

export default function FinancialPage() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["financial-stats"],
        queryFn: () => api.get("/financial/stats").then(res => res.data),
        // placeholderData: { monthlyTotal: 0, variation: 20.1, receipts: [] },
    });

    const total = stats?.monthlyTotal || 0;
    const variation = stats?.variation || 20.1;

    // Colors for Pie Chart
    const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

    return (
        <div className="p-6 space-y-8 bg-background min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
                    <p className="text-muted-foreground mt-1">
                        Controle seus ganhos e emita recibos para pacientes.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Emitir Nota Fiscal
                    </Button>
                    <Button>
                        <Receipt className="mr-2 h-4 w-4" />
                        + Novo Recibo
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Total Recebido (Mês)</CardTitle>
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">
                            {isLoading ? <Skeleton className="h-10 w-32" /> : `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {variation > 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-400" />
                            )}
                            {variation > 0 ? "+" : ""}{variation}% em relação ao mês anterior
                        </p>
                    </CardContent>
                </Card>

                {/* Adicione mais KPIs: Pendentes, Inadimplência, etc. */}
            </div>

            {/* Gráficos */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Line Chart: Receita Mensal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Receita Mensal</CardTitle>
                        <CardDescription>Últimos 6 meses</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockRevenueMonthly}>
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart: Formas de Pagamento */}
                <Card>
                    <CardHeader>
                        <CardTitle>Formas de Pagamento</CardTitle>
                        <CardDescription>Distribuição atual</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockPaymentTypes}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {mockPaymentTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Histórico de Recibos (Tabela) */}
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Recibos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium">ID</th>
                                    <th className="text-left p-3 font-medium">Paciente</th>
                                    <th className="text-left p-3 font-medium">Data</th>
                                    <th className="text-left p-3 font-medium">Valor</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                    <th className="text-right p-3 font-medium">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockReceipts.map((rec) => (
                                    <tr key={rec.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3">{rec.id}</td>
                                        <td className="p-3 font-medium">{rec.patient}</td>
                                        <td className="p-3 text-muted-foreground">{rec.date}</td>
                                        <td className="p-3">R$ {rec.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                        <td className="p-3">
                                            <Badge variant={rec.status === "Pago" ? "default" : "secondary"}>
                                                {rec.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <Button variant="ghost" size="sm">Ver PDF</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
