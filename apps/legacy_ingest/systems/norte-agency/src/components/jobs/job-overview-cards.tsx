import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, Coins, CreditCard, Users, Wallet } from "lucide-react";

type JobOverviewProps = {
    job: any; // We'll refine type later
    client: any;
};

export function JobOverviewCards({ job, client }: JobOverviewProps) {
    // 1. Team Logic
    // Collect all unique users involved: CreatedBy, RequestedBy, ProducedBy, ApprovedBy
    const team = new Map<string, { name: string, role: string, avatar?: string }>();

    // Add Creator
    if (job.createdBy) {
        team.set(job.createdBy.id || 'creator', {
            name: job.createdBy.name || 'Criador',
            role: 'Criador'
        });
    }

    // Add Item Requesters (Client side usually, or Account Manager)
    job.items?.forEach((item: any) => {
        if (item.requestedBy) {
            team.set(item.requestedBy.id, { name: item.requestedBy.name, role: 'Solicitante' });
        }
    });

    const teamList = Array.from(team.values());

    // 2. Budget Logic (Orçamento)
    // Items that are BUDGETED
    const budgetItems = job.items?.filter((i: any) => i.status === 'BUDGETED') || [];
    const budgetTotal = budgetItems.reduce((acc: number, item: any) => acc + (Number(item.unitPrice) * item.quantity), 0);

    // 3. Approved Logic (Produção)
    // Items that are APPROVED, IN_PRODUCTION, DELIVERED
    const productionItems = job.items?.filter((i: any) => ['APPROVED', 'IN_PRODUCTION', 'DELIVERED'].includes(i.status)) || [];
    const productionTotal = productionItems.reduce((acc: number, item: any) => acc + (Number(item.unitPrice) * item.quantity), 0);
    // Cost of production (Internal cost)
    const productionCost = productionItems.reduce((acc: number, item: any) => acc + (Number(item.unitCost) * item.quantity), 0);

    // 4. Cash Flow Logic (Caixa)
    const income = job.transactions?.filter((t: any) => t.type === 'INCOME').reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
    const expense = job.transactions?.filter((t: any) => t.type === 'EXPENSE').reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
    const balance = income - expense;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Cliente / Responsáveis */}
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Cliente / Equipe
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="mb-3">
                        <div className="font-bold text-foreground truncate" title={client.name}>{client.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{client.email}</div>
                    </div>
                    <Separator className="my-2 bg-white/10" />
                    <ScrollArea className="h-[80px]">
                        <div className="space-y-2">
                            {teamList.length > 0 ? teamList.map((member, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[9px] bg-primary/20 text-primary">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-foreground truncate max-w-[100px]" title={member.name}>{member.name}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-white/5 hover:bg-white/10">{member.role}</Badge>
                                </div>
                            )) : (
                                <span className="text-xs text-muted-foreground">Nenhum responsável extra.</span>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Card 2: Orçamento (Solicitados) */}
            <Card className="glass-card border-l-4 border-l-blue-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-400">
                        Orçamento (Aprovar)
                    </CardTitle>
                    <div className="p-1.5 rounded-md bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                        R$ {budgetTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-blue-400/80 mt-1">
                        {budgetItems.length} itens aguardando aprovação
                    </p>
                    <div className="mt-4 flex gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            Solicitado pelo Cliente
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Card 3: Aprovado (Produção) */}
            <Card className="glass-card border-l-4 border-l-emerald-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-emerald-400">
                        Em Produção
                    </CardTitle>
                    <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-500">
                        R$ {productionTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs">
                        <span className="text-emerald-400/80">{productionItems.length} itens aprovados</span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex justify-between items-center">
                        <span className="text-xs text-emerald-500/70">Custo Previsto:</span>
                        <span className="text-sm font-semibold text-emerald-400">
                            R$ {productionCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Card 4: Caixa */}
            <Card className="glass-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Fluxo de Caixa
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowDownLeft className="h-3 w-3 text-emerald-500" /> Entradas
                        </span>
                        <span className="text-sm font-medium text-emerald-500">
                            R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3 text-red-500" /> Saídas
                        </span>
                        <span className="text-sm font-medium text-red-500">
                            R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground">Saldo</span>
                        <span className={`text-base font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
