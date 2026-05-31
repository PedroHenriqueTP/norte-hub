"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, DollarSign, Wallet } from "lucide-react";

interface JobData {
    id: string;
    title: string;
    clientName: string;
    status: string;
    budget: number;
    actualSpend: number;
    deadline: Date | null;
}

interface JobCardProps {
    job: JobData;
    userRole: string; // "OWNER" | "FINANCE" | "PRODUCER_GENERAL" | "PRODUCER_SUPPORT"
}

export function JobCard({ job, userRole }: JobCardProps) {
    // Permission Logic
    const canViewFinancials = ["OWNER", "FINANCE", "PRODUCER_GENERAL"].includes(userRole);
    const canViewProfit = ["OWNER", "FINANCE"].includes(userRole); // General doesn't see profit/margin

    const percentageUsed = job.budget > 0 ? (job.actualSpend / job.budget) * 100 : 0;

    // Status Color Map
    const statusColor = {
        DRAFT: "secondary",
        ACTIVE: "default", // indigo/primary
        COMPLETED: "default", // green ideally
        CANCELED: "destructive",
    } as const;

    return (
        <Card className="hover:shadow-md transition-all duration-300 border-slate-200 dark:border-white/10 dark:bg-zinc-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.clientName}</p>
                </div>
                <Badge variant={statusColor[job.status as keyof typeof statusColor] || "outline"}>
                    {job.status}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                {canViewFinancials ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Wallet className="w-3 h-3" /> Budget Used
                            </span>
                            <span className="font-medium">
                                {Math.round(percentageUsed)}%
                            </span>
                        </div>
                        <Progress value={percentageUsed} className="h-2" />

                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.actualSpend)}</span>
                            <span>of {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(job.budget)}</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-16 flex items-center justify-center bg-slate-50 rounded-md text-xs text-muted-foreground">
                        Financials Hidden
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : "No Deadline"}
                </div>
            </CardContent>
        </Card>
    );
}
