"use client";

import { useActionState, useState } from "react";
import { createProduct, updateProduct } from "@/lib/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MagicCopyButton } from "@/components/magic-copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock type to avoid import issues
type Product = {
    id: string;
    name: string;
    description: string | null;
    price: any;
    stock: number;
    sku: string | null;
    images?: string | null;
};

export default function ProductForm({ product }: { product?: Product }) {
    const action = product ? updateProduct.bind(null, product.id) : createProduct;
    const [errorMessage, formAction, isPending] = useActionState(action as any, undefined);
    const [description, setDescription] = useState(product?.description || "");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Track changes for "unsaved" warning (simplified)
    const handleInputChange = () => setHasUnsavedChanges(true);

    return (
        <form action={formAction} className="space-y-8 pb-10">
            {/* 1. Sticky Header Actions */}
            <div className="sticky top-0 z-20 flex items-center justify-between rounded-lg border bg-background/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-lg font-semibold">
                            {product ? `Editar: ${product.name}` : "Novo Produto"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {hasUnsavedChanges ? "Alterações não salvas" : "Pronto para publicar"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/products">
                        <Button variant="outline" type="button">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={isPending} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* 2. Left Column: Main Content (Tabs) */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1">
                            <TabsTrigger value="general">Geral</TabsTrigger>
                            <TabsTrigger value="pricing">Preços</TabsTrigger>
                            <TabsTrigger value="variations">Variações</TabsTrigger>
                            <TabsTrigger value="marketplaces">Canais</TabsTrigger>
                            <TabsTrigger value="seo">SEO & IA</TabsTrigger>
                        </TabsList>

                        {/* TAB 1: GENERAL */}
                        <TabsContent value="general" className="mt-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações Básicas</CardTitle>
                                    <CardDescription>Dados essenciais do seu produto.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nome do Produto</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={product?.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ex: Tênis Nike Revolution 6"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                handleInputChange();
                                            }}
                                            className="min-h-[150px]"
                                            placeholder="Descreva seu produto detalhadamente..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Imagens</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-10 hover:bg-muted/50 transition-colors cursor-pointer">
                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-sm font-medium">Arraste imagens ou clique para carregar</p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP até 5MB</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: PRICING & STOCK */}
                        <TabsContent value="pricing" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Preços e Estoque</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">Preço de Venda (R$)</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                defaultValue={Number(product?.price || 0)}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cost_price" className="text-muted-foreground">Preço de Custo (Opcional)</Label>
                                            <Input
                                                id="cost_price"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">Estoque Atual</Label>
                                            <Input
                                                id="stock"
                                                name="stock"
                                                type="number"
                                                defaultValue={product?.stock || 0}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sku">SKU</Label>
                                            <Input
                                                id="sku"
                                                name="sku"
                                                defaultValue={product?.sku || ""}
                                                onChange={handleInputChange}
                                                className="font-mono bg-muted/50"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: VARIATIONS */}
                        <TabsContent value="variations" className="mt-6">
                            <Card className="border-dashed">
                                <CardHeader>
                                    <CardTitle>Variações de Produto</CardTitle>
                                    <CardDescription>Crie combinações como Cor e Tamanho.</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center py-10">
                                    <div className="opacity-50 pointer-events-none">
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                                            <div className="h-8 bg-muted rounded animate-pulse"></div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Funcionalidade em desenvolvimento.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 4: MARKETPLACES */}
                        <TabsContent value="marketplaces" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Publicação em Marketplaces</CardTitle>
                                    <CardDescription>Escolha onde este produto estará visível.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { id: 'ml', label: 'Mercado Livre' },
                                        { id: 'shopee', label: 'Shopee' },
                                        { id: 'magalu', label: 'Magalu' },
                                        { id: 'amazon', label: 'Amazon' }
                                    ].map((mkp) => (
                                        <div key={mkp.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30">
                                            <div className="space-y-0.5">
                                                <Label className="text-base">{mkp.label}</Label>
                                                <p className="text-xs text-muted-foreground">Sincronização automática ativa</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 5: SEO & AI */}
                        <TabsContent value="seo" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Magic Copywriter ✨</CardTitle>
                                            <CardDescription>Use IA para otimizar sua descrição para SEO.</CardDescription>
                                        </div>
                                        <MagicCopyButton onGenerate={(text) => {
                                            setDescription(text);
                                            handleInputChange();
                                        }} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md bg-muted p-4">
                                        <p className="text-sm font-mono whitespace-pre-wrap">
                                            {description || "O conteúdo gerado pela IA aparecerá aqui e preencherá a descrição automaticamente."}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 3. Right Column: Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Ativo</span>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <span className="text-sm font-medium">Categoria</span>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option>Eletrônicos</option>
                                    <option>Vestuário</option>
                                    <option>Casa e Decoração</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Desempenho</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Vendas (30d)</span>
                                    <span className="font-medium">0</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Receita</span>
                                    <span className="font-medium">R$ 0,00</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {errorMessage?.error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium text-center">
                    {errorMessage.error}
                </div>
            )}
        </form>
    );
}
