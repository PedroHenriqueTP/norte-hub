"use client";

import { ShoppingBag, Clock, ChevronRight, Check } from 'lucide-react';

export default function DeliveryPage() {
    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-main">Gestão de Delivery</h1>
                    <p className="text-text-muted">Acompanhe pedidos em tempo real de todas as plataformas.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> iFood Conectado
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Rappi Conectado
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column: Novos */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Novos Pedidos (3)</h3>
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-sm font-bold text-primary">#42{90 + i}</span>
                                    <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded">iFood</span>
                                </div>
                                <h4 className="font-bold text-main mb-1">Mariana Lima</h4>
                                <p className="text-sm text-gray-500 mb-3">2x H. Premium, 1x Coca-Cola</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">R$ 89,90</span>
                                    <button className="text-primary hover:underline font-medium">Aceitar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column: Em Preparo */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Em Preparo (2)</h3>
                    </div>

                    <div className="space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-400">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-sm font-bold text-gray-400">#42{80 + i}</span>
                                    <span className="text-xs flex items-center gap-1 text-gray-500">
                                        <Clock size={12} /> 12 min
                                    </span>
                                </div>
                                <h4 className="font-bold text-main mb-1">Carlos Silva</h4>
                                <p className="text-sm text-gray-500 mb-3">1x Pizza G, 2x Guaraná</p>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <div className="flex justify-end">
                                    <button className="text-xs font-bold text-gray-500 hover:text-black">Mover para Entrega →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column: Em Rota */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-200">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Saiu para Entrega (4)</h3>
                    </div>

                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer opacity-75 hover:opacity-100">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-sm font-bold text-gray-400">#42{70 + i}</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Motoboy João</span>
                                </div>
                                <h4 className="font-bold text-main mb-1">Ana Julia</h4>
                                <p className="text-sm text-gray-500">Mesa 05 • Salão</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
