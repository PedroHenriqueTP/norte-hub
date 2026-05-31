"use client";

import { createProposalAction } from "@/actions/proposals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2, FileText, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Item {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
}

export default function NewProposalForm({ clients }: { clients: any[] }) {
    const [items, setItems] = useState<Item[]>([
        { id: 1, description: "", quantity: 1, unitPrice: 0 }
    ]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
    };

    const removeItem = (id: number) => {
        if (items.length === 1) return;
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: number, field: keyof Item, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Top Bar */}
            <div className="flex items-center gap-4">
                <Link href="/proposals">
                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Novo Orçamento</h1>
                    <p className="text-slate-500">Crie propostas comerciais profissionais.</p>
                </div>
            </div>

            <form action={createProposalAction} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Proposal Card */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <div className="h-1 bg-violet-600" />
                            <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-slate-900">Detalhes da Proposta</CardTitle>
                                        <CardDescription>Informações básicas do documento.</CardDescription>
                                    </div>
                                    <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Título / Referência <span className="text-red-500">*</span></Label>
                                    <Input
                                        name="title"
                                        placeholder="Ex: Proposta Comercial #2024-001 - Marketing Digital"
                                        required
                                        className="h-11 font-medium border-slate-200 focus:border-violet-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Introdução</Label>
                                    <Textarea
                                        name="description"
                                        placeholder="Prezados, segue proposta para..."
                                        rows={4}
                                        className="resize-none border-slate-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items Card */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="pb-4 border-b border-slate-100">
                                <CardTitle className="text-lg">Escopo e Valores</CardTitle>
                            </CardHeader>

                            <div className="p-0">
                                <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <div className="col-span-6">Item / Serviço</div>
                                    <div className="col-span-2 text-center">Qtd</div>
                                    <div className="col-span-3 text-right">Valor Unit.</div>
                                    <div className="col-span-1"></div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {items.map((item) => (
                                        <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-slate-50 transition-colors group">
                                            <div className="col-span-6">
                                                <Input
                                                    placeholder="Descrição do serviço..."
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    className="border-transparent focus:border-slate-300 shadow-none px-0 h-auto py-2 font-medium placeholder:font-normal bg-transparent"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                    className="text-center h-9 border-slate-100 focus:border-violet-500"
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-slate-400 text-xs translate-y-0.5">R$</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                        className="text-right h-9 pl-8 font-mono border-slate-100 focus:border-violet-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-slate-50 border-t border-slate-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addItem}
                                        className="bg-white border-dashed border-slate-300 text-slate-600 hover:text-violet-600 hover:border-violet-400"
                                    >
                                        <Plus className="mr-2 h-3 w-3" /> Adicionar Item
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Calculations & Submit */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm bg-slate-900 text-white">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Valor Total Estimado</p>
                                    <div className="text-4xl font-bold tracking-tight">
                                        R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <Separator className="bg-slate-700" />
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Link href="/proposals" className="w-full">
                                            <Button type="button" variant="outline" className="w-full h-12 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent">
                                                Cancelar
                                            </Button>
                                        </Link>
                                    </div>
                                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white h-12 shadow-lg shadow-violet-900/20 font-semibold text-lg">
                                        <Save className="mr-2 h-5 w-5" /> Salvar Proposta
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Configurações</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Cliente Destino</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                        <Select name="clientId" required>
                                            <SelectTrigger className="pl-9 bg-slate-50">
                                                <SelectValue placeholder="Selecione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {clients.map((client: any) => (
                                                    <SelectItem key={client.id} value={client.id}>
                                                        {client.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Validade</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                                        <Input name="validUntil" type="date" className="pl-9 bg-slate-50" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* HIDDEN INPUT */}
                <input type="hidden" name="items" value={JSON.stringify(items)} />
            </form>
        </div>
    );
}
