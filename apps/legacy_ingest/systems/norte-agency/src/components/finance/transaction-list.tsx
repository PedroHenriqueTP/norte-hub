"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Transaction {
    id: string;
    description: string;
    amount: number | object; // Prisma decimal might be object
    type: "INCOME" | "EXPENSE";
    category: string;
    date: Date;
    isVerified: boolean;
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                No transactions recorded yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((t) => (
                <div
                    key={t.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border rounded-lg shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-2 rounded-full ${t.type === "INCOME"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                        >
                            {t.type === "INCOME" ? (
                                <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                                <ArrowUpRight className="w-4 h-4" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{t.description}</p>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{new Date(t.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-[10px] h-5">
                                    {t.category}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p
                            className={`font-semibold ${t.type === "INCOME" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {t.type === "INCOME" ? "+" : "-"}
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(Number(t.amount))}
                        </p>
                        {!t.isVerified && (
                            <Badge variant="secondary" className="text-[10px] h-5">Draft</Badge>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
