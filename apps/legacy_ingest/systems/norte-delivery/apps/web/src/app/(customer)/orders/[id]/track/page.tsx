'use client';

import { useParams } from 'next/navigation';
import { useOrderSocket } from '@/hooks/useOrderSocket';
import { CheckCircle2, Circle, Clock, MapPin, Package, Phone, ChefHat, Bike } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Order Status Enum mapping (simulated matching Prisma)
const STEPS = [
    { status: 'PENDING', label: 'Aguardando', icon: Clock },
    { status: 'PREPARING', label: 'Preparando', icon: ChefHat },
    { status: 'DELIVERING', label: 'A Caminho', icon: Bike },
    { status: 'COMPLETED', label: 'Entregue', icon: CheckCircle2 },
];

export default function TrackingPage() {
    const params = useParams();
    const orderId = params.id as string;
    const { liveOrder, driverLocation } = useOrderSocket(orderId);

    // Fallback state if no live update yet
    const order = liveOrder || { status: 'PENDING' };
    const currentStepIndex = STEPS.findIndex(s => s.status === order.status);

    return (
        <div className="min-h-screen bg-background pb-24 text-foreground">
            {/* Header */}
            <header className="p-4 border-b bg-card sticky top-0 z-10 flex items-center justify-between shadow-sm">
                <Link href="/orders" className="text-sm font-medium btn btn-ghost">← Voltar</Link>
                <h1 className="font-bold text-lg">Pedido #{orderId?.slice(0, 4)}</h1>
                <div className="w-8" />
            </header>

            <main className="p-4 max-w-md mx-auto space-y-6">
                {/* Status Hero */}
                <div className="text-center py-6">
                    <h2 className="text-3xl font-bold tracking-tight text-primary">
                        {STEPS.find(s => s.status === order.status)?.label || order.status}
                    </h2>
                    <p className="text-muted-foreground mt-1">Previsão: 19:40</p>
                </div>

                {/* Map/Visual Area */}
                <div className="aspect-square bg-muted/10 rounded-2xl border-2 border-dashed border-muted flex flex-col items-center justify-center p-6 text-muted-foreground relative overflow-hidden transition-all duration-500">
                    {order.status === 'DELIVERING' || driverLocation ? (
                        <>
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                            <div className="relative z-10 animate-bounce">
                                <Bike className="h-16 w-16 text-primary drop-shadow-xl" />
                            </div>
                            <p className="relative z-10 text-sm font-medium text-primary mt-4 bg-background/80 px-3 py-1 rounded-full shadow-sm border">
                                {driverLocation ? 'Motorista detectado!' : 'Saiu para entrega!'}
                            </p>
                            {driverLocation && (
                                <p className="text-xs font-mono mt-1 text-muted-foreground opacity-60">
                                    {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <MapPin className="h-12 w-12 mb-2 opacity-20" />
                            <p className="text-sm font-medium opacity-60">Mapa indisponível</p>
                        </>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-card rounded-xl border shadow-sm p-6 space-y-6">
                    {STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.status} className="flex gap-4 relative">
                                {/* Connector Line */}
                                {index !== STEPS.length - 1 && (
                                    <div className={`absolute left-[15px] top-8 bottom-[-24px] w-0.5 ${isCompleted && index < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                                )}

                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10 bg-card
                                ${isCompleted ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}
                                ${isCurrent ? 'bg-primary text-white border-primary scale-110 shadow-lg' : ''}
                            `}>
                                    <step.icon size={14} strokeWidth={isCurrent ? 3 : 2} />
                                </div>
                                <div className={`${isCompleted ? 'opacity-100' : 'opacity-50'} pt-1`}>
                                    <p className={`text-sm font-semibold ${isCurrent && 'text-primary'}`}>{step.label}</p>
                                    {isCurrent && <p className="text-xs text-muted-foreground animate-pulse">Em andamento...</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Driver Card */}
                <div className={`bg-card p-4 rounded-xl border flex items-center gap-4 shadow-sm transition-all duration-500 transform
                  ${order.status === 'DELIVERING' ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-50 grayscale'}
              `}>
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center overflow-hidden border">
                        <div className="bg-gradient-to-br from-gray-200 to-gray-400 w-full h-full" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">Jorge Silva</p>
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">4.9 ★</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Honda PCX • ABC-1234</p>
                    </div>
                    <button
                        className="ml-auto bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                        aria-label="Ligar para entregador"
                    >
                        <Phone size={18} />
                    </button>
                </div>
            </main>
        </div>
    )
}
