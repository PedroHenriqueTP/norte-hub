'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, ArrowLeft, Upload, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createVehicle } from "@/app/actions/vehicles"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const vehicleSchema = z.object({
    brand: z.string().min(1, "Marca é obrigatória"),
    model: z.string().min(1, "Modelo é obrigatório"),
    version: z.string().optional(),
    year_manufacture: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    year_model: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
    price_sell: z.coerce.number().min(1, "Preço deve ser maior que zero"),
    mileage: z.coerce.number().min(0, "Quilometragem inválida"),
    fuel_type: z.string().min(1, "Selecione o combustível"),
    transmission: z.string().min(1, "Selecione o câmbio"),
    color: z.string().min(1, "Cor é obrigatória"),
    description: z.string().optional(),
})

type VehicleForm = z.infer<typeof vehicleSchema>

export default function NewVehiclePage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VehicleForm>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            year_manufacture: new Date().getFullYear(),
            year_model: new Date().getFullYear(),
            fuel_type: 'Flex',
            transmission: 'Automático'
        }
    })

    async function onSubmit(data: VehicleForm) {
        setIsLoading(true)
        const formData = new FormData()

        // Append all fields
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString())
            }
        })

        try {
            const result = await createVehicle(formData)
            if (result && 'error' in result) {
                toast.error(result.error)
                setIsLoading(false)
            } else {
                toast.success("Veículo cadastrado com sucesso!")
                // Redirect is handled by server action, but we can fast track UI if needed
            }
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/app/dashboard/vehicles"
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Novo Veículo</h1>
                    <p className="text-zinc-500 text-sm">Adicione um novo carro ao seu estoque.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-red-600 rounded-full"></span>
                        Dados Principais
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Marca</label>
                            <input {...register("brand")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500" placeholder="Ex: Toyota" />
                            {errors.brand && <span className="text-red-600 text-xs">{errors.brand.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Modelo</label>
                            <input {...register("model")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500" placeholder="Ex: Corolla" />
                            {errors.model && <span className="text-red-600 text-xs">{errors.model.message}</span>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Versão</label>
                            <input {...register("version")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500" placeholder="Ex: 2.0 XEi 16V Flex 4P Automático" />
                        </div>
                    </div>
                </section>

                {/* Specs */}
                <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-zinc-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-red-600 rounded-full"></span>
                        Especificações e Preço
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Ano Fab.</label>
                            <input type="number" {...register("year_manufacture")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500" />
                            {errors.year_manufacture && <span className="text-red-600 text-xs">{errors.year_manufacture.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Ano Mod.</label>
                            <input type="number" {...register("year_model")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500" />
                            {errors.year_model && <span className="text-red-600 text-xs">{errors.year_model.message}</span>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Combustível</label>
                            <select {...register("fuel_type")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500">
                                <option value="Flex">Flex</option>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Etanol">Etanol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Elétrico">Elétrico</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Câmbio</label>
                            <select {...register("transmission")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500">
                                <option value="Automático">Automático</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Cor</label>
                            <input {...register("color")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500" placeholder="Ex: Preto" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">KM</label>
                            <input type="number" {...register("mileage")} className="input-premium bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-red-500 focus:ring-red-500" placeholder="0" />
                        </div>
                        <div className="space-y-2 md:col-span-2 relative">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Preço de Venda (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">R$</span>
                                <input
                                    type="number"
                                    {...register("price_sell")}
                                    className="input-premium pl-10 text-lg font-bold text-emerald-600 bg-zinc-50 border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="0,00"
                                />
                            </div>
                            {errors.price_sell && <span className="text-red-600 text-xs">{errors.price_sell.message}</span>}
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-500 text-white font-medium px-8 py-3 rounded-xl transition-all 
                flex items-center gap-2 shadow-lg shadow-red-600/20 hover:shadow-red-600/40
                disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                        Salvar Veículo
                    </button>
                </div>
            </form>
        </div>
    )
}
