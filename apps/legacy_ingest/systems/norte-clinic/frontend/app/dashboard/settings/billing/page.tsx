"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
    const queryClient = useQueryClient();

    const { data: plans } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/billing/plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const { data: subscription } = useQuery({
        queryKey: ['my-subscription'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/billing/my-subscription`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const subscribeMutation = useMutation({
        mutationFn: async (planId: number) => {
            const token = localStorage.getItem('token');
            return axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/billing/subscribe`, { plan_id: planId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
            toast.success("Plano assinado com sucesso!");
            alert("Plano assinado com sucesso! (Simulação)");
        },
        onError: () => {
            toast.error("Erro ao assinar plano.");
            alert("Erro ao assinar plano.");
        }
    });

    const featuresMock = (planName: string) => {
        if (planName.toLowerCase() === 'basic') return ["Agenda Básica", "1 Usuário", "Suporte Email"];
        if (planName.toLowerCase() === 'pro') return ["Agenda Avançada", "Até 5 Usuários", "Suporte Prioritário", "Financeiro", "Faturamento"];
        if (planName.toLowerCase() === 'enterprise') return ["Tudo Ilimitado", "API Dedicada", "Gerente de Conta", "Treinamento", "Customização"];
        return ["Funcionalidades do plano"];
    };

    const iconsMock = (planName: string) => {
        if (planName.toLowerCase() === 'enterprise') return <Shield className="h-6 w-6 text-purple-500" />;
        if (planName.toLowerCase() === 'pro') return <Star className="h-6 w-6 text-yellow-500" />;
        return <Zap className="h-6 w-6 text-blue-500" />;
    };

    return (
        <div className="space-y-6 container mx-auto py-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Planos e Faturamento</h1>
                <p className="text-muted-foreground">Gerencie sua assinatura e escolha o melhor plano para sua clínica.</p>
            </div>

            {subscription && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Assinatura Atual
                            <Badge variant="default" className="ml-2 capitalize">
                                {subscription.status}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            Renova em: {new Date(subscription.current_period_end).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Você está inscrito no plano <strong>{subscription.plan?.name}</strong>.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-3 pt-6">
                {plans?.length === 0 && <p>Nenhum plano disponível no momento.</p>}

                {plans?.map((plan: any) => (
                    <Card key={plan.id} className={`flex flex-col relative ${subscription?.plan_id === plan.id ? 'border-primary shadow-md' : ''}`}>
                        {subscription?.plan_id === plan.id && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                ATUAL
                            </div>
                        )}
                        <CardHeader>
                            <div className="mb-4">
                                {iconsMock(plan.name)}
                            </div>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description || "O plano ideal para você."}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-6">
                                R$ {plan.price.toFixed(2)}
                                <span className="text-sm font-normal text-muted-foreground">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {featuresMock(plan.name).map((feat, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={subscription?.plan_id === plan.id ? "outline" : "default"}
                                onClick={() => subscribeMutation.mutate(plan.id)}
                                disabled={subscription?.plan_id === plan.id || subscribeMutation.isPending}
                            >
                                {subscription?.plan_id === plan.id ? "Plano Atual" : "Assinar Agora"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
