"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calculator } from "lucide-react";

// Schema Validation
const formSchema = z.object({
    title: z.string().min(2, "Título é obrigatório"),
    description: z.string().optional().default(""),
    quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
    unitPrice: z.coerce.number().min(0, "Preço inválido"),
    unitCost: z.coerce.number().min(0, "Custo inválido"),
    producedById: z.string().optional().default("none"),
});

// Definindo os tipos explicitamente para o Hook Form
type FormValues = z.infer<typeof formSchema>;

interface JobItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "add" | "edit";
    initialData?: any; 
    users: { id: string; name: string | null; email: string }[];
    onSubmit: (data: FormValues) => Promise<void>;
}

export function JobItemDialog({ open, onOpenChange, mode, initialData, users, onSubmit }: JobItemDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            unitCost: 0,
            producedById: "none",
        },
    });

    // Reset form logic
    useEffect(() => {
        if (open) {
            if (mode === "edit" && initialData) {
                form.reset({
                    title: initialData.title || initialData.description || "",
                    description: initialData.description || "",
                    quantity: Number(initialData.quantity) || 1,
                    unitPrice: Number(initialData.unitPrice) || 0,
                    unitCost: Number(initialData.unitCost) || 0,
                    producedById: initialData.producedById || "none",
                });
            } else {
                form.reset({
                    title: "",
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                    unitCost: 0,
                    producedById: "none",
                });
            }
        }
    }, [open, mode, initialData, form]);

    const quantity = form.watch("quantity") || 0;
    const unitPrice = form.watch("unitPrice") || 0;
    const unitCost = form.watch("unitCost") || 0;

    const totalRevenue = quantity * unitPrice;
    const totalCost = quantity * unitCost;
    const estimatedProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;

    async function handleSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            const cleanValues = {
                ...values,
                producedById: values.producedById === "none" ? undefined : values.producedById
            };
            await onSubmit(cleanValues as any);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    // O restante do seu JSX permanece o mesmo, 
    // mas agora o TypeScript reconhece os tipos numéricos corretamente.
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-white text-slate-900 border-slate-200 shadow-xl">
                {/* ... (seu código de DialogHeader) */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Campos identificação */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Nome do Item</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Roteiro..." className="bg-white border-slate-300" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* ... (outros campos) */}
                        </div>

                        {/* Dados Financeiros */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                            <div className="grid grid-cols-3 gap-5">
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-600 text-xs uppercase font-bold">Qtd.</FormLabel>
                                            <FormControl>
                                                <Input type="number" className="bg-white border-slate-300" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unitPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-blue-600 text-xs uppercase font-bold">Preço Unit.</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" className="bg-white border-blue-200" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="unitCost"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-red-600 text-xs uppercase font-bold">Custo Unit.</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" className="bg-white border-red-200" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* ... (Widgets de lucro) */}
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Item
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}