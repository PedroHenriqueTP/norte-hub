'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Store, Save, Palette, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

const siteSchema = z.object({
    storeName: z.string().min(3, "Nome muito curto"),
    slug: z.string().min(3, "URL muito curta").regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e traços"),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida"),
    description: z.string().optional(),
})

type SiteForm = z.infer<typeof siteSchema>

export default function SiteEditorPage() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SiteForm>({
        resolver: zodResolver(siteSchema),
        defaultValues: {
            storeName: "Minha Loja",
            slug: "minha-loja",
            primaryColor: "#dc2626", // Red-600
            description: "A melhor loja de carros da região."
        }
    })

    async function onSubmit(data: SiteForm) {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(data)
        toast.success("Site atualizado com sucesso!")
        setIsLoading(false)
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Editor do Site</h1>
                <p className="text-zinc-500 mt-1">Personalize a aparência da sua loja online.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
                {/* Identity Section */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                        <Store className="w-5 h-5 text-red-600" />
                        Identidade da Loja
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Nome da Loja</label>
                            <input {...register("storeName")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500" />
                            {errors.storeName && <span className="text-red-600 text-xs">{errors.storeName.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">URL (Slug)</label>
                            <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 transition-all">
                                <span className="text-zinc-400 text-sm mr-1">autoshop.com/</span>
                                <input {...register("slug")} className="bg-transparent outline-none w-full text-zinc-900" />
                            </div>
                            {errors.slug && <span className="text-red-600 text-xs">{errors.slug.message}</span>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Descrição (SEO)</label>
                            <textarea {...register("description")} rows={3} className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-400" />
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-red-600" />
                        Aparência
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Cor Primária</label>
                            <div className="flex items-center gap-4">
                                <input type="color" {...register("primaryColor")} className="h-10 w-20 rounded cursor-pointer border-0 p-0" />
                                <span className="text-sm text-zinc-500">Selecione a cor principal da sua marca.</span>
                            </div>
                            {errors.primaryColor && <span className="text-red-600 text-xs">{errors.primaryColor.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Logo / Capa</label>
                            <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-400 hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer bg-zinc-50">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-sm font-medium">Clique para fazer upload</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-500 text-white font-medium px-8 py-3 rounded-xl transition-all 
                flex items-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-red-600/40
                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    )
}
