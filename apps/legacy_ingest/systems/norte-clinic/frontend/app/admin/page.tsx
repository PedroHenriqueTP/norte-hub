"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Activity, Server, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Visão Geral do Admin</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium border border-green-500/20">
                    <Activity className="h-4 w-4" />
                    <span>Sistema Online</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border-blue-600/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+4 novos este mês</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-600/10 to-emerald-600/5 border-emerald-600/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Mensal (MRR)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 12.450,00</div>
                        <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border-purple-600/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85</div>
                        <p className="text-xs text-muted-foreground">98% taxa de adimplência</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-600/10 to-orange-600/5 border-orange-600/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Status do Servidor</CardTitle>
                        <Server className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">99.9%</div>
                        <p className="text-xs text-muted-foreground">Uptime últimos 30 dias</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">Novo usuário cadastrado</p>
                                        <p className="text-sm text-muted-foreground">
                                            Dr. Exemplo {i} acabou de assinar o plano Pro.
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-muted-foreground">
                                        Há {i * 2} min
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Distribuição de Planos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder for Chart */}
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            Gráfico de Pizza (Em Breve)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
