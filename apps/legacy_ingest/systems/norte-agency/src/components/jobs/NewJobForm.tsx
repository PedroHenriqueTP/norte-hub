"use client";


import { createJobAction } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Briefcase, CalendarIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export default function NewJobForm({ clients }: { clients: any[] }) {
    const hasClients = clients.length > 0;
    const [date, setDate] = useState<Date>();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/jobs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Novo Job</h1>
            </div>

            <form action={createJobAction} className="space-y-6">
                <input type="hidden" name="deadline" value={date ? date.toISOString() : ''} />

                {/* Section 1: Detalhes do Job */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2 text-violet-600">
                            <Briefcase size={20} />
                            <CardTitle className="text-base font-semibold">Detalhes do Projeto</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Título do Job *</Label>
                            <Input
                                name="title"
                                placeholder="Ex: Campanha de Verão 2024"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Cliente *</Label>
                            <Select name="clientId" required defaultValue={hasClients ? clients[0].id : "STANDARD_CLIENT"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o Cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STANDARD_CLIENT" className="font-semibold text-violet-600">
                                        ★ Usar Cliente Padrão (Rápido)
                                    </SelectItem>
                                    {clients.length > 0 && <div className="my-1 border-t border-slate-100" />}
                                    {clients.map((client: any) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Descrição / Briefing</Label>
                            <Textarea
                                name="description"
                                placeholder="Detalhes do projeto, objetivos e entregáveis..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Planejamento */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2 text-violet-600">
                            <CalendarIcon size={20} />
                            <CardTitle className="text-base font-semibold">Planejamento</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label>Prazo de Entrega (Deadline)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? (
                                                format(date, "PPP", { locale: ptBR })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            locale={ptBR}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Orçamento Previsto (R$)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        name="budget"
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/jobs">
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-700 min-w-[150px]">
                        <Save className="mr-2 h-4 w-4" /> Criar Job
                    </Button>
                </div>
            </form>
        </div>
    );
}
