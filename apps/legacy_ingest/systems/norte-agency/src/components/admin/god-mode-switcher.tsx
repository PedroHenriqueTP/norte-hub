"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, ArrowRightLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simulando dados que viriam da sua API
const MOCK_TENANTS = [
    { id: "tenant_1", name: "Rocket Marketing", role: "OWNER", email: "ceo@rocket.com" },
    { id: "tenant_2", name: "Studio Alpha", role: "MEMBER", email: "dev@alpha.com" },
    { id: "tenant_3", name: "Blue Ocean", role: "ADMIN", email: "admin@blue.com" },
];

export function GodModeSwitcher({ isImpersonating = false }: { isImpersonating?: boolean }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState("");
    const [targetEmail, setTargetEmail] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleImpersonate = async (tenantEmail: string) => {
        if (!tenantEmail) return;

        setIsLoading(true);
        try {
            // Simulating Server Action delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log(`[GOD MODE] Switching to tenant: ${tenantEmail}`);
            // In a real scenario, this would set a cookie/session and redirect

            setIsOpen(false);
            router.refresh(); // Simulate UI update
            // router.push('/dashboard'); // Redirect to tenant dashboard
        } catch (error) {
            console.error("Failed to impersonate", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDevMode = () => {
        // Quick Dev Access: Set cookie to bypass middleware restriction
        document.cookie = "agency-os-impersonating=true; path=/";
        window.location.href = "/dashboard";
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-purple-600"
                onClick={handleDevMode}
            >
                <ArrowRightLeft className="mr-2 h-3 w-3" />
                Dev: Acessar Dashboard
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant={isImpersonating ? "destructive" : "outline"} className="gap-2">
                        {isImpersonating ? (
                            <>
                                <ArrowRightLeft className="h-4 w-4" />
                                Sair do God Mode
                            </>
                        ) : (
                            <>
                                <Users className="h-4 w-4" />
                                Acessar como Tenant
                            </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>God Mode (Super Admin)</DialogTitle>
                        <DialogDescription>
                            Selecione um tenant para acessar o sistema como se fosse ele.
                            Todas as ações serão registradas no audit log.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email do Usuário Alvo</Label>
                            <Input
                                id="email"
                                placeholder="ex: ceo@rocket.com"
                                value={targetEmail}
                                onChange={(e) => setTargetEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Ou selecione da lista (Mock)</Label>
                            <div className="grid gap-2">
                                {MOCK_TENANTS.map((tenant) => (
                                    <button
                                        key={tenant.id}
                                        onClick={() => {
                                            setTargetEmail(tenant.email);
                                            handleImpersonate(tenant.email);
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors text-left"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{tenant.name}</p>
                                            <p className="text-xs text-slate-500">{tenant.role} • {tenant.email}</p>
                                        </div>
                                        {isLoading && targetEmail === tenant.email && (
                                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {targetEmail && (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleImpersonate(targetEmail)}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Acessando...
                                    </>
                                ) : (
                                    'Acessar Painel'
                                )}
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
