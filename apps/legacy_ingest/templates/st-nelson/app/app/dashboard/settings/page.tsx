export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Configurações</h1>
                <p className="text-zinc-500 mt-1">Gerencie as preferências da sua loja e conta.</p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                    <span className="text-2xl">⚙️</span>
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Em Breve</h2>
                <p className="text-zinc-500 max-w-sm mx-auto">
                    Em breve você poderá personalizar todos os aspectos da sua loja por aqui.
                </p>
            </div>
        </div>
    )
}
