"use client";

import { useState } from "react";
import { OrderDataTable } from "./data-table";
import { columns, Order } from "./columns";
import { Button } from "@/components/ui/button";
import { LayoutList, Kanban } from "lucide-react";

// Mock Data for display
const MOCK_ORDERS: Order[] = [
    { id: "1001", customer: "Maria Silva", total: 150.00, status: "paid", channel: "Mercado Livre", createdAt: "2026-01-21" },
    { id: "1002", customer: "João Souza", total: 45.90, status: "shipped", channel: "Shopee", createdAt: "2026-01-20" },
    { id: "1003", customer: "Ana Costa", total: 890.00, status: "pending", channel: "Site Próprio", createdAt: "2026-01-22" },
    { id: "1004", customer: "Carlos Lima", total: 29.90, status: "delivered", channel: "Magalu", createdAt: "2026-01-15" },
    { id: "1005", customer: "Beatriz Rocha", total: 1200.00, status: "cancelled", channel: "Amazon", createdAt: "2026-01-18" },
];

export default function OrdersPage() {
    const [view, setView] = useState<"list" | "kanban">("list");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
                    <p className="text-muted-foreground">Gerencie seus envios e status.</p>
                </div>

                <div className="flex items-center gap-2 bg-muted p-1 rounded-md">
                    <Button
                        variant={view === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("list")}
                    >
                        <LayoutList className="h-4 w-4 mr-2" /> Lista
                    </Button>
                    <Button
                        variant={view === "kanban" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setView("kanban")}
                    >
                        <Kanban className="h-4 w-4 mr-2" /> Quadro
                    </Button>
                </div>
            </div>

            {view === "list" ? (
                <OrderDataTable columns={columns} data={MOCK_ORDERS} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[500px]">
                    {/* Placeholder Kanban */}
                    {["Pendente", "A Enviar", "Enviado", "Entregue", "Cancelado"].map(status => (
                        <div key={status} className="bg-muted/30 rounded-lg p-4 flex flex-col gap-2">
                            <h3 className="font-semibold text-sm text-center mb-2">{status}</h3>
                            <div className="bg-background border rounded p-3 shadow-sm text-center text-muted-foreground text-sm">
                                Arrastar e soltar (Em breve)
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
