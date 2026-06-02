
"use client";

import { useState } from 'react';
import { RefreshCw, Power, ExternalLink } from 'lucide-react';

type IntegrationConfig = {
    id: string;
    name: string;
    color: string;
    bgColor: string;
    borderColor: string;
    logo: React.ReactNode;
    description: string;
    storeIdPlaceholder: string;
    status: 'available' | 'coming_soon';
};

export default function IntegrationsPage() {
    // Mock State - In a real app, this would come from API
    const [connectedProviders, setConnectedProviders] = useState<Record<string, boolean>>({
        'ifood': false,
        'rappi': false,
        'ubereats': false,
        '99food': false,
        'glovo': false,
        'justeat': false
    });
    const [loadingState, setLoadingState] = useState<Record<string, boolean>>({});

    const toggleIntegration = (provider: string) => {
        setLoadingState(prev => ({ ...prev, [provider]: true }));
        setTimeout(() => {
            setConnectedProviders(prev => ({ ...prev, [provider]: !prev[provider] }));
            setLoadingState(prev => ({ ...prev, [provider]: false }));
        }, 1500);
    };

    const integrations: IntegrationConfig[] = [
        {
            id: 'ifood',
            name: 'iFood',
            color: 'text-red-600',
            bgColor: 'bg-red-500',
            borderColor: 'border-red-200',
            logo: <span className="text-white font-black italic text-2xl">iF</span>,
            description: 'Receba pedidos em tempo real, sincronize cardápios e status de entrega.',
            storeIdPlaceholder: 'Loja ID: 849201-SP',
            status: 'available'
        },
        {
            id: 'rappi',
            name: 'Rappi',
            color: 'text-orange-600',
            bgColor: 'bg-orange-500',
            borderColor: 'border-orange-200',
            logo: <span className="text-white font-bold tracking-tighter text-lg">Rappi</span>,
            description: 'Integração completa com Turbos e gestão de entregadores parceiros.',
            storeIdPlaceholder: 'Loja ID: BR-9921',
            status: 'available'
        },
        {
            id: 'ubereats',
            name: 'Uber Eats',
            color: 'text-green-600',
            bgColor: 'bg-green-500',
            borderColor: 'border-green-200',
            logo: <span className="text-white font-bold text-lg">Uber</span>,
            description: 'Expanda suas vendas conectando-se à maior plataforma de transporte.',
            storeIdPlaceholder: 'Loja ID: UE-1234',
            status: 'available'
        },
        {
            id: '99food',
            name: '99 Food',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-400',
            borderColor: 'border-yellow-200',
            logo: <span className="text-black font-black text-xl">99</span>,
            description: 'Alcance novos clientes com a base de usuários da 99.',
            storeIdPlaceholder: 'Loja ID: 99-5555',
            status: 'available'
        },
        {
            id: 'glovo',
            name: 'Glovo',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500',
            borderColor: 'border-yellow-200',
            logo: <span className="text-green-900 font-bold italic text-lg">Glovo</span>,
            description: 'Entregas rápidas de qualquer coisa em sua cidade.',
            storeIdPlaceholder: 'Store ID: GL-777',
            status: 'available'
        },
        {
            id: 'justeat',
            name: 'Just Eat',
            color: 'text-red-700',
            bgColor: 'bg-red-600',
            borderColor: 'border-red-200',
            logo: <span className="text-white font-bold text-xs flex flex-col items-center leading-none"><span>JUST</span><span>EAT</span></span>,
            description: 'Plataforma líder em delivery na Europa e outros mercados.',
            storeIdPlaceholder: 'Restaurant ID: JE-88',
            status: 'available'
        }
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-main">Integrações</h1>
                    <p className="text-text-muted">Conecte sua loja aos principais marketplaces.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app) => {
                    const isConnected = connectedProviders[app.id];
                    const isLoading = loadingState[app.id];

                    return (
                        <div
                            key={app.id}
                            className={`bg-white rounded-2xl border transition-all 
                            ${isConnected
                                    ? `${app.borderColor} shadow-md ring-1 ring-offset-0 ${app.id === 'glovo' ? 'ring-yellow-200' : 'ring-opacity-50'}`
                                    : 'border-gray-100 hover:shadow-md'
                                }`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-16 h-16 ${app.bgColor} rounded-xl flex items-center justify-center shadow-lg bg-opacity-90`}>
                                        {app.logo}
                                    </div>
                                    {isConnected ? (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Conectado
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                                            Desconectado
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-main mb-2">{app.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                                    {app.description}
                                </p>

                                {isConnected ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 border border-gray-100 flex justify-between items-center">
                                            {app.storeIdPlaceholder}
                                            <ExternalLink className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <button
                                            onClick={() => toggleIntegration(app.id)}
                                            disabled={isLoading}
                                            className={`w-full py-3 border font-bold rounded-xl transition-colors flex items-center justify-center gap-2
                                                ${app.id === '99food' ? 'border-yellow-200 text-yellow-700 hover:bg-yellow-50' : ''}
                                                ${app.id.includes('food') && app.id !== '99food' ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}
                                                ${app.id === 'rappi' ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : ''}
                                                ${app.id === 'ubereats' ? 'border-green-200 text-green-600 hover:bg-green-50' : ''}
                                                ${!['99food', 'ifood', 'rappi', 'ubereats'].includes(app.id) ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : ''}
                                            `}
                                        >
                                            {isLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Power className="w-4 h-4" />}
                                            Desconectar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => toggleIntegration(app.id)}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-main text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <RefreshCw className="animate-spin w-4 h-4" /> : 'Conectar Conta'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}


            </div>
        </div>
    );
}
