"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const data = [
    { date: "Jan", MRR: 32000 },
    { date: "Fev", MRR: 35000 },
    { date: "Mar", MRR: 38500 },
    { date: "Abr", MRR: 42000 },
    { date: "Mai", MRR: 45231 },
    { date: "Jun", MRR: 48000 },
];

export function FinancialPerformanceChart() {
    return (
        <Card className="col-span-4 border-slate-200 shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-700">Crescimento de Receita (MRR)</CardTitle>
                <p className="text-xs text-slate-400 font-mono">Valores baseados em subscrições ativas</p>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `R$${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'MRR']}
                            />
                            <Area
                                type="monotone"
                                dataKey="MRR"
                                stroke="#0ea5e9"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorMrr)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
