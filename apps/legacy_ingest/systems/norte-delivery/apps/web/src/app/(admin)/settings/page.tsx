"use client";

import { Save, User, Bell, Lock, Globe } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-main mb-2">Configurações</h1>
            <p className="text-text-muted mb-8">Gerencie suas preferências e dados da loja.</p>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-3 min-h-[600px]">
                    {/* Sidebar */}
                    <div className="bg-gray-50/50 p-6 border-r border-gray-100">
                        <nav className="space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-primary font-bold rounded-xl shadow-sm border border-gray-100">
                                <User size={18} /> Perfil da Loja
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                                <Bell size={18} /> Notificações
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                                <Lock size={18} /> Segurança
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                                <Globe size={18} /> Integrações
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="col-span-2 p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-main mb-6">Informações Básicas</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Restaurante</label>
                                    <input
                                        defaultValue="Delivery Platform HQ"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                                        <input
                                            defaultValue="11 99999-9999"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
                                        <input
                                            defaultValue="00.000.000/0001-00"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Endereço</label>
                                    <input
                                        defaultValue="Av. Paulista, 1000 - São Paulo, SP"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                <Save size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
