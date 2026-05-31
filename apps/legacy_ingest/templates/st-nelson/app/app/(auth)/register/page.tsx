'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ArrowRight, Store, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { signup } from "@/app/actions/auth" // We will update this later to handle Org creation if needed, or do it in a separate step
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Schema
const registerSchema = z.object({
    fullName: z.string().min(3, "Nome muito curto"),
    storeName: z.string().min(3, "Nome da loja muito curto"),
    slug: z.string().min(3, "URL muito curta").regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e traços"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [generatedSlug, setGeneratedSlug] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    })

    // Auto-generate slug from store name
    const storeNameWatch = watch("storeName")
    if (storeNameWatch && !watch("slug")) {
        const slug = storeNameWatch.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        // We don't verify uniqueness live here yet to save API calls, but we could.
        // Ideally we should use setValue but avoid infinite loops or overwriting user edits.
        // For this MVP, let's just show it or set it once.
        // Simple approach:
    }

    const handleStoreNameBlur = () => {
        const currentName = watch("storeName")
        if (currentName && !watch("slug")) {
            const slug = currentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            setValue("slug", slug)
            setGeneratedSlug(slug)
        }
    }

    async function onSubmit(data: RegisterForm) {
        setIsLoading(true)
        console.log("🚀 Iniciando registro...", data)

        const formData = new FormData()
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("options[data][full_name]", data.fullName)
        formData.append("options[data][store_name]", data.storeName)
        formData.append("options[data][store_slug]", data.slug)

        try {
            console.log("📤 Enviando para Server Action (signup)...")
            const result = await signup(formData)
            console.log("📥 Resultado do Server Action:", result)

            if (result && 'error' in result) {
                console.error("❌ Erro retornado:", result.error)
                toast.error(result.error)
                setIsLoading(false)
            } else {
                console.log("✅ Sucesso! Aguardando redirecionamento...")
                toast.success("Conta criada! Redirecionando...")
                // Redirect handling is usually automatic in server action or we wait.
            }
        } catch (error) {
            // Next.js throws 'NEXT_REDIRECT' as an error when redirect() is called in a Server Action.
            // This is actually a success case.
            if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || error.message.includes('NEXT_REDIRECT'))) {
                console.log("✅ Redirecionamento detectado (Sucesso).")
                toast.success("Redirecionando para o painel...")
                return
            }

            console.error("🔥 Erro Crítico (Catch):", error)
            toast.error(`Erro ao registrar: ${error instanceof Error ? error.message : String(error)}`)
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl shadow-gray-200/50">
                <div className="space-y-2 mb-8 text-center">
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Crie sua AutoShop</h1>
                    <p className="text-zinc-500 text-sm">Comece a vender carros online em minutos.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Seu Nome</label>
                            <input
                                {...register("fullName")}
                                className="w-full bg-gray-50 border border-zinc-200 text-zinc-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-zinc-400"
                                placeholder="Ex: João da Silva"
                            />
                            {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</label>
                            <input
                                {...register("email")}
                                className="w-full bg-gray-50 border border-zinc-200 text-zinc-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-zinc-400"
                                placeholder="admin@loja.com"
                            />
                            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Senha</label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full bg-gray-50 border border-zinc-200 text-zinc-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-zinc-400"
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800 my-6" />

                    {/* Store Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Store className="w-3 h-3 text-red-600" /> Nome da Loja
                            </label>
                            <input
                                {...register("storeName")}
                                onBlur={handleStoreNameBlur}
                                className="w-full bg-gray-50 border border-zinc-200 text-zinc-900 rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all placeholder:text-zinc-400"
                                placeholder="Ex: Prime Motors"
                            />
                            {errors.storeName && <span className="text-red-500 text-xs">{errors.storeName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">URL da Loja</label>
                            <div className="flex items-center bg-gray-50 border border-zinc-200 rounded-lg px-4 py-3 focus-within:border-red-500 transition-all">
                                <span className="text-zinc-500 text-sm mr-1">autoshop.com/</span>
                                <input
                                    {...register("slug")}
                                    className="bg-transparent text-zinc-900 outline-none w-full placeholder:text-zinc-400"
                                    placeholder="prime-motors"
                                />
                            </div>
                            {errors.slug && <span className="text-red-500 text-xs">{errors.slug.message}</span>}
                            {generatedSlug && !errors.slug && (
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> URL disponível (simulação)
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-all 
            flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]
            disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Criar Minha Loja
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-zinc-500 text-sm">
                        Já tem uma conta?{" "}
                        <Link href="/app/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
