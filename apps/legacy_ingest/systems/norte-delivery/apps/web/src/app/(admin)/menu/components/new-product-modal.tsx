'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle, UploadCloud, X } from 'lucide-react';

// Interface auxiliar para a lista de ingredientes na tela
interface RecipeItem {
    ingredientId: string;
    quantity: number;
}

export function NewProductModal() {
    const [open, setOpen] = useState(false);

    // Dados do Produto
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // --- FICHA TÉCNICA (Ingredientes do Produto) ---
    const [recipe, setRecipe] = useState<RecipeItem[]>([]);

    // Simulação: Numa aplicação real, você buscaria isso da sua API (/ingredients)
    const availableIngredients = [
        { id: '1', name: 'Pão de Hambúrguer', unit: 'UN' },
        { id: '2', name: 'Carne Moída', unit: 'KG' },
        { id: '3', name: 'Queijo Cheddar', unit: 'KG' },
        { id: '4', name: 'Alface', unit: 'Maço' },
    ];

    // Adiciona uma nova linha de ingrediente
    const addIngredientRow = () => {
        setRecipe([...recipe, { ingredientId: '', quantity: 0 }]);
    };

    // Remove uma linha
    const removeIngredientRow = (index: number) => {
        const newRecipe = [...recipe];
        newRecipe.splice(index, 1);
        setRecipe(newRecipe);
    };

    // Atualiza os valores da linha
    const updateIngredientRow = (index: number, field: keyof RecipeItem, value: string | number) => {
        const newRecipe = [...recipe];
        // @ts-ignore
        newRecipe[index][field] = value;
        setRecipe(newRecipe);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            product: { name, price, category, description },
            recipe: recipe // Aqui vai a lista de ingredientes para o Backend descontar do estoque!
        });
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
                <Plus size={20} /> Novo Produto
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* CLASSE PARA AUMENTAR O TAMANHO DO MODAL - 900px */}
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Novo Produto do Cardápio</h2>
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* LADO ESQUERDO: Dados Básicos */}
                            <div className="space-y-6">
                                <h3 className="font-bold text-lg border-b pb-2 text-gray-700">Informações de Venda</h3>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome do Produto</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                        placeholder="Ex: X-Burger Especial"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Preço (R$)</label>
                                        <input
                                            type="number" step="0.01"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoria</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-white"
                                            onChange={e => setCategory(e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="LANCHES">Lanches</option>
                                            <option value="BEBIDAS">Bebidas</option>
                                            <option value="SOBREMESAS">Sobremesas</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Descrição</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all min-h-[100px]"
                                        placeholder="Ingredientes visíveis para o cliente..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors group">
                                    <UploadCloud size={32} className="mb-2 text-gray-300 group-hover:text-green-500 transition-colors" />
                                    <span className="font-medium">Arraste uma imagem ou clique aqui</span>
                                </div>
                            </div>

                            {/* LADO DIREITO: Ficha Técnica (Conexão com Estoque) */}
                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Ficha Técnica</h3>
                                        <p className="text-xs text-slate-500 font-medium">Isso será descontado do estoque a cada venda.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addIngredientRow}
                                        className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Item
                                    </button>
                                </div>

                                <div className="space-y-3 min-h-[200px]">
                                    {recipe.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-xl">
                                            Nenhum ingrediente vinculado.<br />O estoque não será alterado ao vender este item.
                                        </div>
                                    )}

                                    {recipe.map((row, index) => (
                                        <div key={index} className="flex gap-2 items-end animate-in slide-in-from-left duration-300">
                                            <div className="flex-1">
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">Ingrediente</label>
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none bg-white"
                                                    onChange={(e) => updateIngredientRow(index, 'ingredientId', e.target.value)}
                                                >
                                                    <option value="">Escolha...</option>
                                                    {availableIngredients.map(ing => (
                                                        <option key={ing.id} value={ing.id}>
                                                            {ing.name} ({ing.unit})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="w-24">
                                                <label className="text-xs font-bold text-slate-500 mb-1 block">Qtd.</label>
                                                <input
                                                    type="number"
                                                    step="0.001"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 outline-none"
                                                    placeholder="0.000"
                                                    onChange={(e) => updateIngredientRow(index, 'quantity', parseFloat(e.target.value))}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className="h-[38px] w-[38px] flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                onClick={() => removeIngredientRow(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Alerta Visual de Integração */}
                                <div className="bg-blue-50 text-blue-800 text-xs p-4 rounded-xl flex gap-3 items-start border border-blue-100">
                                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                                    <p className="font-medium leading-relaxed">
                                        Ao salvar, o sistema calculará automaticamente o <strong>CMV</strong> deste produto baseada na soma dos custos dos ingredientes selecionados.
                                    </p>
                                </div>

                            </div>
                        </form>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-6 py-3 text-gray-600 font-bold hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
                            >
                                Salvar Produto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
