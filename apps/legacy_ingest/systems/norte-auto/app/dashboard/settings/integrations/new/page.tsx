import { auth } from "@/auth";
import db from "@/lib/db";
import {
    ShoppingBag,
    Globe,
    Truck,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const INTEGRATIONS = [
    { id: 'mercadolivre', name: 'Mercado Livre', region: ['BR', 'LATAM'], icon: ShoppingBag },
    { id: 'magalu', name: 'Magalu', region: ['BR'], icon: ShoppingBag },
    { id: 'shopee', name: 'Shopee', region: ['BR', 'LATAM', 'SEA'], icon: ShoppingBag },
    { id: 'amazon_br', name: 'Amazon Brasil', region: ['BR'], icon: ShoppingBag },
    { id: 'amazon_us', name: 'Amazon US', region: ['US'], icon: Globe },
    { id: 'ebay', name: 'eBay', region: ['US', 'EU', 'GLOBAL'], icon: Globe },
    { id: 'woocommerce', name: 'WooCommerce', region: ['GLOBAL'], icon: ShoppingBag },
];

export default async function NewIntegrationPage() {
    const session = await auth();
    const user = await db.user.findUnique({
        where: { id: session?.user?.id }
    });

    const userRegion = user?.region || 'BR';
    const isCrossBorder = user?.isCrossBorder || false;

    // Filter Logic
    const availableIntegrations = INTEGRATIONS.filter(integration => {
        const isLocal = integration.region.includes(userRegion) || integration.region.includes('GLOBAL');
        const isInternational = !isLocal; // Simply, if not local, it's international in this context logic

        if (isCrossBorder) return true; // Show all if cross-border
        return isLocal;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Adicionar Integração</h1>
                    <p className="text-muted-foreground">
                        Mostrando opções para sua região: <span className="font-bold">{userRegion}</span>
                    </p>
                </div>
                {/* In a real app, this would be a server action toggle */}
                <Button variant="outline">
                    {isCrossBorder ? "Ocultar Internacionais" : "Mostrar Internacionais (Cross-border)"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 flex flex-col items-center gap-4 hover:bg-slate-50 transition-colors">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <item.icon className="h-6 w-6" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-bold">{item.name}</h3>
                            <div className="flex gap-1 justify-center">
                                {item.region.map(r => (
                                    <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                                ))}
                            </div>
                        </div>
                        <Button className="w-full mt-2">Conectar</Button>
                    </div>
                ))}
            </div>

            {availableIntegrations.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Nenhuma integração encontrada para sua região.
                </div>
            )}
        </div>
    );
}
