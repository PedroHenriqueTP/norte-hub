import { createClientAction } from "@/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewClientPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/clients">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Novo Cliente</h1>
            </div>

            <form action={createClientAction} className="space-y-6">

                {/* Section 1: Dados Cadastrais */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2 text-violet-600">
                            <User size={20} />
                            <CardTitle className="text-base font-semibold">Dados Cadastrais</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome Completo / Empresa *</Label>
                                <Input name="name" placeholder="Ex: Acme Corp Ltda" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Documento (CPF / CNPJ)</Label>
                                <Input name="document" placeholder="00.000.000/0000-00" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Contato */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2 text-violet-600">
                            <Phone size={20} />
                            <CardTitle className="text-base font-semibold">Contato</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>E-mail</Label>
                                <Input name="email" type="email" placeholder="contato@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefone / WhatsApp</Label>
                                <Input name="phone" placeholder="(11) 99999-9999" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Endereço */}
                <Card>
                    <CardHeader className="pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2 text-violet-600">
                            <MapPin size={20} />
                            <CardTitle className="text-base font-semibold">Endereço</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-2">
                                <Label>Rua / Logradouro</Label>
                                <Input name="address" placeholder="Av. Paulista, 1000" />
                            </div>
                            <div className="space-y-2">
                                <Label>Cidade</Label>
                                <Input name="city" placeholder="São Paulo" />
                            </div>
                            <div className="space-y-2">
                                <Label>Estado (UF)</Label>
                                <Select name="state">
                                    <SelectTrigger>
                                        <SelectValue placeholder="UF" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SP">São Paulo</SelectItem>
                                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                        <SelectItem value="MG">Minas Gerais</SelectItem>
                                        <SelectItem value="PR">Paraná</SelectItem>
                                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                        {/* Add more as needed */}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                    <Link href="/clients">
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-700 min-w-[150px]">
                        <Save className="mr-2 h-4 w-4" /> Salvar Cliente
                    </Button>
                </div>
            </form>
        </div>
    );
}
