import { getAuthContext } from "@/services/auth-context";
import { prisma } from "@/lib/prisma";
import { FinanceService } from "@/services/finance.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, TrendingDown, DollarSign, Search, Calendar, Wallet, ArrowDownCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function FinancePage() {
    const { tenantId } = await getAuthContext();
    const { transactions, income, expenses, balance } = await FinanceService.with(tenantId).getMonthSummary();

    // Fintech Module: Busca da Digital Wallet
    const wallet = await prisma.digitalWallet.findUnique({
        where: { tenantId }
    });
    const cashbackBalance = wallet ? Number(wallet.balance) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Financeiro</h1>
                    <p className="text-muted-foreground">Fluxo de caixa e lançamentos do mês.</p>
                </div>
                <Link href="/finance/new">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Novo Lançamento
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card border-l-4 border-l-green-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Entradas (Mês)</CardTitle>
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">
                            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-red-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Saídas (Mês)</CardTitle>
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">
                            R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-l-4 border-l-violet-500/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
                        <div className="p-2 rounded-lg bg-violet-500/10">
                            <DollarSign className="h-4 w-4 text-violet-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${balance >= 0 ? 'text-foreground' : 'text-red-500'}`}>
                            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FINTECH: DIGITAL WALLET & CASHBACK RESCUE */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-full lg:col-span-1">
                    <Card className="glass-card border-l-4 border-l-emerald-500/50 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-500"></div>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-emerald-400">Digital Wallet (Cashback)</CardTitle>
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <Wallet className="h-4 w-4 text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-black text-white mt-2">
                                R$ {cashbackBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                            <p className="text-xs text-slate-400 mt-2 font-medium">Créditos disponíveis para abatimento de fatura ou uso na NorteStore.</p>
                            <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50">
                                <ArrowDownCircle className="mr-2 h-4 w-4" /> Resgatar Créditos
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 flex gap-4">
                    <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-500" />
                        Transações Recentes
                    </h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>Nenhuma transação encontrada neste mês.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-muted-foreground font-medium uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Descrição</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Job Relacionado</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-6 py-4 font-medium text-foreground">{t.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-white/5 border border-white/10 text-muted-foreground rounded-full text-xs font-medium capitalize">
                                                {t.category.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(t.date, 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {t.job ? (
                                                <span className="text-violet-400 hover:text-violet-300 hover:underline cursor-pointer transition-colors">
                                                    {t.job.title}
                                                </span>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            {t.type === 'INCOME' ? '+' : '-'} R$ {Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
