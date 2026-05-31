import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Briefcase,
    CreditCard,
    Users,
    Calendar as CalendarIcon,
    ArrowRight,
    Truck,
    AlertCircle,
    Zap
} from "lucide-react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { ScheduleWidget } from "@/components/dashboard/schedule-widget";
import { DevToolsWidget } from "@/components/dashboard/dev-tools-widget";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const session = await auth();
    if (!session || !session.user) return redirect("/login");

    // Even if Super Admin, we want to see the Agency Dashboard view (for the main tenant context)
    // If we wanted a pure Admin View, we would redirect to /admin or have a toggle.
    // user instruction: "remova os cards de tenants e global mrr... e substitua por cards para o owner da agencia"

    const tenantId = session.user.tenantId;

    let tenantStats = null;
    let hasError = false;

    if (tenantId) {
        try {
            tenantStats = await DashboardService.with(tenantId).getStats();
        } catch (e) {
            console.error("Failed to fetch dashboard stats", e);
            hasError = true;
        }
    }

    // Default empty stats if loading fails or no tenant
    const stats = tenantStats || {
        openJobsCount: 0,
        clientsCount: 0,
        suppliersCount: 0,
        cashFlow: { income: 0, expenses: 0, balance: 0 },
        todayAgenda: []
    };

    return (
        <div className="space-y-6">
            <WelcomeHeader />

            <div className="mb-6">
                <DevToolsWidget />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* EXPERIMENTAL: Agency Owner Cards Replaces Super Admin View */}
                <div className="md:col-span-2 grid gap-4 grid-cols-2 md:grid-cols-3">

                    {/* 1. CAIXA (Financeiro) */}
                    <Link href="/finance">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm h-full group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-green-600 transition-colors">Caixa</CardTitle>
                                <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${stats.cashFlow.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                                    R$ {stats.cashFlow.balance.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Saldo do mês</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 2. JOBS ABERTOS */}
                    <Link href="/jobs">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm h-full group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-violet-600 transition-colors">Jobs Ativos</CardTitle>
                                <Briefcase className="h-4 w-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stats.openJobsCount}</div>
                                <p className="text-xs text-slate-400 mt-1">Em andamento</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 3. PENDÊNCIAS (Agenda/Deadlines) */}
                    <Link href="/jobs">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm h-full group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-orange-600 transition-colors">Pendências</CardTitle>
                                <AlertCircle className="h-4 w-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stats.todayAgenda.length}</div>
                                <p className="text-xs text-slate-400 mt-1">Para hoje</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 4. CLIENTES */}
                    <Link href="/clients">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm h-full group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Clientes</CardTitle>
                                <Users className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stats.clientsCount}</div>
                                <p className="text-xs text-slate-400 mt-1">Ativos</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 5. FORNECEDORES */}
                    <Link href="/suppliers">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 shadow-sm h-full group">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-cyan-600 transition-colors">Fornecedores</CardTitle>
                                <Truck className="h-4 w-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stats.suppliersCount}</div>
                                <p className="text-xs text-slate-400 mt-1">Parceiros</p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* 6. SHORTCUT NEW job (Abertura Rápida) */}
                    <Link href="/jobs/new" className="h-full">
                        <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-dashed border-slate-300 shadow-none bg-slate-50/50 h-full flex flex-col justify-center items-center group">
                            <CardContent className="flex flex-col items-center justify-center py-6">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center mb-2 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <span className="font-semibold text-sm text-slate-600 group-hover:text-slate-900">Novo Job Rápido</span>
                            </CardContent>
                        </Card>
                    </Link>

                </div>

                {/* RIGHT COLUMN: Schedule List Widget */}
                <div className="md:col-span-1">
                    <ScheduleWidget events={stats.todayAgenda} />
                </div>
            </div>
        </div>
    );
}
