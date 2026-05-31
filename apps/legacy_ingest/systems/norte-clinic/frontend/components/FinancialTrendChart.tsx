"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialData {
    date: string;
    amount: number;
}

const data = [
    { date: "Seg", amount: 1200 },
    { date: "Ter", amount: 2100 },
    { date: "Qua", amount: 1800 },
    { date: "Qui", amount: 2400 },
    { date: "Sex", amount: 3200 },
    { date: "Sáb", amount: 1500 },
    { date: "Dom", amount: 0 },
];

export function FinancialTrendChart() {
    // In a real app, fetch data here. Using static data for UI demo as requested.
    const isLoading = false;

    return (
        <Link href="/dashboard/financial" className="block group">
            <Card className="organic-card border-none shadow-none bg-gradient-to-br from-white/60 to-white/30 overflow-hidden relative h-full">
                {/* Background decorative blob for highlighting */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-all duration-500" />

                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-700">Faturamento Semanal</CardTitle>
                            <CardDescription className="text-slate-500">Visão geral de rendimentos</CardDescription>
                        </div>
                        <div className="bg-emerald-100 p-2 rounded-full transform group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600">R$ 12.200</span>
                        <span className="text-sm font-medium text-emerald-500 flex items-center gap-0.5">
                            +12% <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="h-[180px] w-full p-0 pb-2 relative z-10">
                    <div className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
