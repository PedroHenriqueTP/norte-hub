'use client'
import { useState } from "react"
import { Monitor, Smartphone, Layout, Palette, Code, Eye, Save } from "lucide-react"

export default function EnginePage() {
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

    return (
        <div className="flex h-[calc(100vh-6rem)] -m-4 md:-m-8">
            {/* Controls Sidebar */}
            <div className="w-80 bg-white border-r border-zinc-200 flex flex-col overflow-y-auto">
                <div className="p-6 border-b border-zinc-200">
                    <h2 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Code className="w-5 h-5 text-red-600" />
                        Page Engine
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">Construtor de sites inteligente.</p>
                </div>

                <div className="flex-1 p-6 space-y-8">
                    {/* Sections Toggle */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seções da Página</h3>
                        <div className="space-y-3">
                            <ToggleItem label="Hero Section (Banner)" defaultChecked />
                            <ToggleItem label="Estoque em Destaque" defaultChecked />
                            <ToggleItem label="Sobre a Loja" defaultChecked />
                            <ToggleItem label="Depoimentos" />
                            <ToggleItem label="Rodapé (Footer)" defaultChecked />
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100" />

                    {/* Theme Selector */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tema Visual</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <ThemeOption name="Clean White" color="bg-white border-zinc-200" active />
                            <ThemeOption name="Dark Luxury" color="bg-zinc-900 border-zinc-700" />
                            <ThemeOption name="Sport Red" color="bg-red-50 border-red-200" />
                            <ThemeOption name="Corporate" color="bg-blue-50 border-blue-200" />
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100" />

                    {/* Domain */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Domínio</h3>
                        <div className="p-3 bg-zinc-50 rounded-lg text-sm border border-zinc-200 break-all text-zinc-600">
                            prime-motors.autoshop.com
                        </div>
                        <button className="text-xs text-red-600 font-medium hover:underline">
                            Conectar domínio próprio
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-200">
                    <button className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Salvar e Publicar
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-zinc-100 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border border-zinc-200 rounded-full p-1 flex gap-1 shadow-sm z-10 transition-all">
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded-full transition-colors ${previewMode === 'desktop' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded-full transition-colors ${previewMode === 'mobile' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <div className="w-px bg-zinc-200 mx-1" />
                    <button className="px-3 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Ver ao vivo
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                    <div
                        className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden border border-zinc-200
                        ${previewMode === 'desktop' ? 'w-full h-full rounded-xl' : 'w-[375px] h-[750px] rounded-[3rem] border-8 border-zinc-900'}
                        `}
                    >
                        {/* Fake Website Preview */}
                        <div className="w-full h-full overflow-y-auto bg-white">
                            <div className="h-64 bg-zinc-900 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold mb-2">Prime Motors</h1>
                                    <p className="text-zinc-400">Os melhores carros da região</p>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/3] bg-zinc-100 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ToggleItem({ label, defaultChecked }: { label: string, defaultChecked?: boolean }) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{label}</span>
            <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </div>
        </label>
    )
}

function ThemeOption({ name, color, active }: { name: string, color: string, active?: boolean }) {
    return (
        <div className={`p-3 rounded-lg border cursor-pointer transition-all ${active ? 'ring-2 ring-red-500 border-transparent' : 'border-zinc-200 hover:border-zinc-300'}`}>
            <div className={`w-full h-12 rounded-md mb-2 ${color}`}></div>
            <p className="text-xs font-medium text-center text-zinc-900">{name}</p>
        </div>
    )
}
