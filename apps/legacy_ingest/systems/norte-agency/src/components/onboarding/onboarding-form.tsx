"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OnboardingForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const result = await completeOnboarding(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/dashboard"); // Redirect to dashboard on success
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader>
                <CardTitle>Bem-vindo ao AgencyOS</CardTitle>
                <CardDescription>
                    Vamos configurar seu ambiente de trabalho.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="agencyName">Nome da Agência</Label>
                        <Input
                            id="agencyName"
                            name="agencyName"
                            placeholder="Ex: Agência Criativa"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="document">CPF ou CNPJ</Label>
                        <Input
                            id="document"
                            name="document"
                            placeholder="000.000.000-00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Seu Nome (Opcional)</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Como você quer ser chamado?"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Criando ambiente..." : "Começar Agora"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
