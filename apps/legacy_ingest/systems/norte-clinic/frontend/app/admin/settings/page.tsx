"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HardDrive, AlertTriangle, Shield, Globe } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);

    const handleBackup = async () => {
        setBackupLoading(true);
        // Simulate backup
        await new Promise(resolve => setTimeout(resolve, 2000));
        setBackupLoading(false);
        alert("Backup do sistema iniciado com sucesso! Você receberá o arquivo por email.");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-orange-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Zona de Perigo
                        </CardTitle>
                        <CardDescription>Controles sensíveis que afetam todo o sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
                                <span>Modo de Manutenção</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Bloqueia o acesso de todos os usuários exceto admins.
                                </span>
                            </Label>
                            <Switch
                                id="maintenance-mode"
                                checked={maintenanceMode}
                                onCheckedChange={setMaintenanceMode}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label className="flex flex-col space-y-1">
                                <span>Reiniciar Serviços</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Reinicia os containers da aplicação.
                                </span>
                            </Label>
                            <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                                Reiniciar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5 text-blue-500" />
                            Dados e Backup
                        </CardTitle>
                        <CardDescription>Gerencie a integridade dos dados.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label className="flex flex-col space-y-1">
                                <span>Backup Manual</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Gera um dump completo do banco de dados agora.
                                </span>
                            </Label>
                            <Button onClick={handleBackup} disabled={backupLoading}>
                                {backupLoading ? "Gerando..." : "Fazer Backup"}
                            </Button>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                            Último backup automático: <strong>Hoje às 03:00 AM</strong>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-purple-500" />
                            Segurança
                        </CardTitle>
                        <CardDescription>Políticas de acesso e sessões.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="2fa-force" className="flex flex-col space-y-1">
                                <span>Forçar 2FA</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Obriga todos os doutores a usarem autenticação de dois fatores.
                                </span>
                            </Label>
                            <Switch id="2fa-force" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
