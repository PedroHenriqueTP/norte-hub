export default function AdminSettingsPage() {
    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Configurações do Sistema</h1>
                <p className="text-zinc-500 mt-1">Parâmetros globais da plataforma AutoShop.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-900 border-b border-zinc-100 pb-4">Geral</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zinc-900">Manutenção do Sistema</p>
                                <p className="text-xs text-zinc-500">Suspende o acesso de todos os lojistas.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-zinc-900">Novos Cadastros</p>
                                <p className="text-xs text-zinc-500">Permitir que novas lojas se cadastrem.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Plans & Billing */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold text-zinc-900 border-b border-zinc-100 pb-4">Planos e Preços</h2>

                    <div className="space-y-4">
                        <div className="p-4 border border-zinc-200 rounded-lg flex justify-between items-center hover:bg-zinc-50 transition-colors">
                            <div>
                                <p className="font-bold text-zinc-900">Plano Básico</p>
                                <p className="text-sm text-zinc-500">R$ 199,00 / mês</p>
                            </div>
                            <button className="text-sm font-medium text-red-600 hover:underline">Editar</button>
                        </div>
                        <div className="p-4 border border-zinc-200 rounded-lg flex justify-between items-center hover:bg-zinc-50 transition-colors">
                            <div>
                                <p className="font-bold text-zinc-900">Plano Pro</p>
                                <p className="text-sm text-zinc-500">R$ 299,00 / mês</p>
                            </div>
                            <button className="text-sm font-medium text-red-600 hover:underline">Editar</button>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-dashed border-zinc-300 rounded-lg text-sm text-zinc-500 hover:border-red-500 hover:text-red-500 transition-colors">
                        + Criar Novo Plano
                    </button>
                </section>
            </div>
        </div>
    )
}
