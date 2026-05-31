import { createTransactionAction } from "@/actions/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function NewTransactionPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/finance">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Novo Lançamento</h1>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <form action={createTransactionAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Descrição *</Label>
                        <Input name="description" placeholder="Ex: Pagamento Fornecedor X" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Valor (R$) *</Label>
                            <Input name="amount" type="number" step="0.01" placeholder="0,00" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Data *</Label>
                            <Input name="date" type="date" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tipo *</Label>
                            <Select name="type" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INCOME">Entrada (Receita)</SelectItem>
                                    <SelectItem value="EXPENSE">Saída (Despesa)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Categoria *</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRODUCTION">Produção</SelectItem>
                                    <SelectItem value="LOGISTICS">Logística</SelectItem>
                                    <SelectItem value="TALENT">Talento / Freelancer</SelectItem>
                                    <SelectItem value="MARKETING">Marketing</SelectItem>
                                    <SelectItem value="TAXES">Impostos</SelectItem>
                                    <SelectItem value="OTHER">Outros / Administrativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Job Relacionado (Opcional)</Label>
                        <Select name="jobId">
                            <SelectTrigger>
                                <SelectValue placeholder="Vincular a um Job (Em breve)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {/* Todo: Fetch active jobs to populate list */}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">Selecione 'Nenhum' para despesas gerais da agência.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            <Save className="mr-2 h-4 w-4" /> Salvar Lançamento
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
