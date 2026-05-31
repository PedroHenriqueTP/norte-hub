"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: user, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            try {
                // api instance already handles baseURL and interceptors
                const res = await api.get('/api/v1/users/me');
                return res.data;
            } catch (err: any) {
                console.error("Fetch Me Error:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // Token removal and redirect handled by interceptor but good to have fallback/UI rectivity
                    queryClient.setQueryData(['me'], null);
                }
                throw err;
            }
        },
        retry: 1
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            return api.put('/api/v1/users/me', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            toast("Informações atualizadas com sucesso!");
        },
        onError: () => toast.error("Erro ao atualizar informações.")
    });

    // ... handleUpload ...
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadRes = await api.post('/api/v1/upload/profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            updateMutation.mutate({ profile_image: uploadRes.data.url });
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Falha ao atualizar foto.");
        }
    };

    const handleSaveProfessional = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateMutation.mutate({
            crm: formData.get('crm'),
            personal_phone: formData.get('personal_phone'),
            chatbot_phone: formData.get('chatbot_phone'),
            certificate_template: formData.get('certificate_template'),
        });
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Carregando perfil...</p>
            <p className="text-xs text-muted-foreground">Se demorar muito, verifique se o backend está rodando.</p>
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center text-red-500">
            <h3 className="font-bold">Erro ao carregar perfil</h3>
            <p className="text-sm">{(error as any)?.message || "Verifique sua conexão ou faça login novamente."}</p>
            <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" onClick={() => refetch()}>Tentar Novamente</Button>
                <Button variant="link" onClick={() => router.push('/login')}>Ir para Login</Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                    Gerencie seu perfil, aparência e dados profissionais.
                </p>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="account">Perfil & Conta</TabsTrigger>
                    <TabsTrigger value="professional">Profissional</TabsTrigger>
                    <TabsTrigger value="finance">Financeiro</TabsTrigger>
                    <TabsTrigger value="appearance">Aparência</TabsTrigger>
                    <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto de Perfil</CardTitle>
                            <CardDescription>
                                Atualize sua foto de perfil. Clique na imagem para alterar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                                <Avatar className="h-24 w-24 border-4 border-muted transition-all group-hover:border-primary">
                                    <AvatarImage src={user?.profile_image} />
                                    <AvatarFallback className="text-2xl">{user?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-medium">Alterar</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium">Sua Foto</h4>
                                <p className="text-xs text-muted-foreground">
                                    Min 400x400px, PNG ou JPG.
                                </p>
                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Pessoais</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                updateMutation.mutate({
                                    full_name: formData.get('full_name'),
                                    email: formData.get('email') // Typically email chage requires verification, but allowing for now based on request
                                });
                            }} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Nome Completo</Label>
                                    <Input name="full_name" defaultValue={user?.full_name || ''} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email</Label>
                                    <Input name="email" defaultValue={user?.email || ''} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={updateMutation.isPending}>Salvar Perfil</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Segurança</CardTitle>
                            <CardDescription>Alterar senha de acesso.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const pass = formData.get('password') as string;
                                const confirm = formData.get('confirm_password') as string;
                                if (pass !== confirm) {
                                    alert("As senhas não coincidem!");
                                    return;
                                }
                                if (pass.length < 6) {
                                    alert("A senha deve ter pelo menos 6 caracteres.");
                                    return;
                                }
                                updateMutation.mutate({ password: pass });
                                (e.target as HTMLFormElement).reset();
                            }} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Nova Senha</Label>
                                    <Input name="password" type="password" placeholder="******" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Confirmar Nova Senha</Label>
                                    <Input name="confirm_password" type="password" placeholder="******" />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" variant="outline" disabled={updateMutation.isPending}>Atualizar Senha</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados do Médico</CardTitle>
                            <CardDescription>
                                Informações usadas em receitas e configurações do Chatbot.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveProfessional} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="crm">CRM / Registro</Label>
                                        <Input id="crm" name="crm" defaultValue={user?.crm || ''} placeholder="Ex: CRM/SP 123456" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="personal_phone">Telefone Pessoal</Label>
                                        <Input id="personal_phone" name="personal_phone" defaultValue={user?.personal_phone || ''} placeholder="+55 11 99999-9999" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="chatbot_phone">Telefone do Chatbot (WhatsApp API)</Label>
                                    <Input id="chatbot_phone" name="chatbot_phone" defaultValue={user?.chatbot_phone || ''} placeholder="ID do Telefone ou Número" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="certificate_template">Modelo de Atestado/Receita (Texto Padrão)</Label>
                                    <Textarea
                                        id="certificate_template"
                                        name="certificate_template"
                                        defaultValue={user?.certificate_template || ''}
                                        placeholder="Digite aqui um texto padrão para seus atestados..."
                                        className="h-32"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Integração de Agenda</CardTitle>
                            <CardDescription>
                                Conecte sua agenda do CRM com Google Calendar, Apple Calendar ou Outlook.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Seu Link de Assinatura (ICS)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/calendar/feed?token=access_token`}
                                    />
                                    <Button variant="outline" onClick={() => {
                                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/calendar/feed?token=access_token`);
                                        toast("Link copiado!");
                                    }}>
                                        Copiar
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Cole este link na opção "Adicionar Calendário por URL" do seu aplicativo preferido.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tema</CardTitle>
                            <CardDescription>
                                Escolha entre o tema claro ou escuro.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="theme-mode" className="flex flex-col space-y-1">
                                    <span>Modo Escuro</span>
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Sun className="h-4 w-4 text-muted-foreground" />
                                    <Switch
                                        id="theme-mode"
                                        checked={theme === 'dark'}
                                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                    />
                                    <Moon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuração Fiscal (NF-e)</CardTitle>
                            <CardDescription>
                                Configure sua integração com a Focus NFe ou Nuvem Fiscal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CNPJ do Emissor</Label>
                                    <Input placeholder="00.000.000/0000-00" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Token de API (Produção)</Label>
                                    <Input type="password" placeholder="sk_live_..." />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="sandbox-mode" />
                                <Label htmlFor="sandbox-mode">Modo Sandbox (Testes)</Label>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => alert("Chaves salvas (Simulação)!")}>
                                    Salvar Chaves
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Backup do Sistema</CardTitle>
                            <CardDescription>
                                Baixe uma cópia completa dos dados do banco de dados (JSON) para segurança.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Exportar Dados</h4>
                                    <p className="text-sm text-muted-foreground">O download iniciará automaticamente.</p>
                                </div>
                                <Button onClick={async () => {
                                    try {
                                        const res = await api.get('/api/v1/backup/', {
                                            responseType: 'blob'
                                        });
                                        const url = window.URL.createObjectURL(new Blob([res.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', `backup_full_${new Date().toISOString().slice(0, 10)}.json`);
                                        document.body.appendChild(link);
                                        link.click();
                                        link.remove();
                                    } catch (err) {
                                        console.error(err);
                                        toast.error("Erro ao realizar backup. Verifique se você é administrador.");
                                    }
                                }}>
                                    Fazer Backup Agora
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
