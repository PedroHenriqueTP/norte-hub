import { auth } from "@/auth";
import db from "@/lib/db";
import { updateNotificationSettings } from "@/lib/notification-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default async function NotificationSettingsPage() {
    const session = await auth();
    const settings = await db.notificationSettings.findUnique({
        where: { userId: session?.user?.id }
    }) || { emailSales: true, emailLowStock: true, emailSecurity: true }; // defaults

    return (
        <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-bold">Preferências de Notificação</h1>
            <p className="text-muted-foreground">Escolha como você quer ser avisado.</p>

            <form action={updateNotificationSettings}>
                <Card>
                    <CardHeader>
                        <CardTitle>Notificações por Email</CardTitle>
                        <CardDescription>Gerencie quais emails você recebe.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailSales" className="text-base">Novas Vendas</Label>
                                <p className="text-sm text-muted-foreground">Receba um email a cada pedido realizado.</p>
                            </div>
                            <Switch id="emailSales" name="emailSales" defaultChecked={settings.emailSales} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailLowStock" className="text-base">Estoque Baixo</Label>
                                <p className="text-sm text-muted-foreground">Aviso quando produto chegar em 5 unidades.</p>
                            </div>
                            <Switch id="emailLowStock" name="emailLowStock" defaultChecked={settings.emailLowStock} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="emailSecurity" className="text-base">Segurança</Label>
                                <p className="text-sm text-muted-foreground">Logins suspeitos e expiração de token.</p>
                            </div>
                            <Switch id="emailSecurity" name="emailSecurity" defaultChecked={settings.emailSecurity} disabled />
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end">
                    <Button type="submit">Salvar Alterações</Button>
                </div>
            </form>
        </div>
    );
}
