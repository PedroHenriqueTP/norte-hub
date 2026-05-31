"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Printer, X } from "lucide-react";
import { Order } from "./columns"; // We'll define this type in columns

interface OrderDetailsSheetProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailsSheet({ order, isOpen, onClose }: OrderDetailsSheetProps) {
    if (!order) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-bold">Pedido #{order.id}</SheetTitle>
                        {/* Close button is built-in to SheetContent usually, but we can have custom actions */}
                    </div>
                    <SheetDescription>
                        Detalhes completos do pedido e timeline de rastreamento.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Status & Customer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                            <Badge variant={
                                order.status === "delivered" ? "default" : // Green-ish usually default or success
                                    order.status === "shipped" ? "secondary" :
                                        order.status === "paid" ? "default" :
                                            order.status === "cancelled" ? "destructive" : "outline"
                            }>
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Data</h4>
                            <p className="font-medium">
                                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div>
                        <h3 className="font-semibold mb-2">Cliente</h3>
                        <div className="rounded-md border p-3 text-sm space-y-1">
                            <p className="font-medium">{order.customer || "Cliente não identificado"}</p>
                            <p className="text-muted-foreground">CPF: 123.456.789-00</p>
                            <p className="text-muted-foreground">email@exemplo.com</p>
                            <p className="mt-2 text-muted-foreground">
                                Rua das Flores, 123 - Centro<br />
                                São Paulo - SP, 01000-000
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Items */}
                    <div>
                        <h3 className="font-semibold mb-2">Itens do Pedido</h3>
                        <div className="space-y-3">
                            {/* Mock Items Logic */}
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-muted rounded-md" />
                                    <div>
                                        <p className="font-medium">Produto Exemplo A</p>
                                        <p className="text-muted-foreground">R$ 100,00 x 1</p>
                                    </div>
                                </div>
                                <p className="font-medium">R$ 100,00</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order.total)}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Timeline Mock */}
                    <div>
                        <h3 className="font-semibold mb-2">Timeline</h3>
                        <div className="border-l-2 border-muted ml-2 space-y-4 pl-4 py-2">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                <p className="text-sm font-medium">Pedido Recebido</p>
                                <p className="text-xs text-muted-foreground">22/01/2026 10:00</p>
                            </div>
                            {order.status === 'paid' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary" />
                                    <p className="text-sm font-medium">Pagamento Confirmado</p>
                                    <p className="text-xs text-muted-foreground">22/01/2026 10:05</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-8">
                    <Button className="w-full gap-2">
                        <Printer className="h-4 w-4" /> Imprimir Etiqueta
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
