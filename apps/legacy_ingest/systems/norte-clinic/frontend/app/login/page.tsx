"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ChatWidget from "@/components/ChatWidget";
import { Activity, Lock } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const apiUrl = 'http://127.0.0.1:8000'; // Hardcoded for debugging
            console.log(`Attempting login to: ${apiUrl}/api/v1/login/access-token`);

            const res = await axios.post(`${apiUrl}/api/v1/login/access-token`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            console.log("Login successful", res.data);
            localStorage.setItem('token', res.data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            console.error("Login Error Full:", err);
            let msg = "Login failed.";
            if (err.response) {
                msg = `Server Error (${err.response.status}): ${err.response.data?.detail || err.message}`;
            } else if (err.request) {
                msg = "Network Error: Unable to reach the server at " + 'http://127.0.0.1:8000' + ". Is the backend running?";
            } else {
                msg = err.message;
            }
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <div className="absolute inset-0 bg-grid-slate-200/[0.2] dark:bg-grid-slate-800/[0.2] -z-10" />

            <div className="mb-8 text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Activity size={40} className="text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    MedCura CRM
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Advanced Patient Management & Triage System
                </p>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Entrar</CardTitle>
                    <CardDescription className="text-center">
                        Digite suas credenciais para acessar o painel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="admin@medcura.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (
                                <span className="animate-pulse">Entrando...</span>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" /> Entrar
                                </>
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-xs text-muted-foreground">
                        <p>Credenciais de Demo: <strong>admin@medcura.com</strong> / <strong>password</strong></p>
                    </div>
                </CardContent>
            </Card>

            <ChatWidget />
        </main>
    );
}
