"use client";

import { useState, useEffect } from 'react';
import { Package, X, Calculator, Info } from 'lucide-react';

interface NewIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export function NewIngredientModal({ isOpen, onClose, onSave }: NewIngredientModalProps) {
    // Form States
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('KG');
    const [quantity, setQuantity] = useState(''); // Purchase Quantity
    const [totalCost, setTotalCost] = useState(''); // Total Cost (R$)
    const [yieldAmount, setYieldAmount] = useState(''); // Yield (Portions)
    const [unitCmv, setUnitCmv] = useState(0); // Calculated Automatically
    const [isSaving, setIsSaving] = useState(false);

    // Auto-calculate CMV
    useEffect(() => {
        const cost = parseFloat(totalCost);
        const rendimento = parseFloat(yieldAmount);

        if (cost > 0 && rendimento > 0) {
            // Unit CMV = Total Cost / Yield
            setUnitCmv(cost / rendimento);
        } else {
            setUnitCmv(0);
        }
    }, [totalCost, yieldAmount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                name,
                unit,
                totalQuantity: parseFloat(quantity),
                totalCost: parseFloat(totalCost),
                yield: parseFloat(yieldAmount),
                unitCost: unitCmv
            });
            onClose();
            // Reset form
            setName('');
            setUnit('KG');
            setQuantity('');
            setTotalCost('');
            setYieldAmount('');
            setUnitCmv(0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Cadastrar Mercadoria</h2>
                        <p className="text-gray-500 text-sm">Insira os dados da nota fiscal para cálculo do CMV.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Basic Info */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Mercadoria</label>
                            <input
                                value={name} onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Filé Mignon"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all placeholder:text-gray-300"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Unidade</label>
                            <select
                                value={unit} onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all bg-white"
                            >
                                <option value="KG">Quilo (KG)</option>
                                <option value="LT">Litro (L)</option>
                                <option value="UN">Unidade (UN)</option>
                                <option value="CX">Caixa (CX)</option>
                                <option value="PC">Peça (PC)</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Purchase Data */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Quantidade Comprada</label>
                            <div className="relative">
                                <input
                                    type="number" step="0.001"
                                    placeholder="Ex: 5"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all"
                                    required
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">{unit}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Custo Total (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                                <input
                                    type="number" step="0.01"
                                    placeholder="Ex: 200.00"
                                    value={totalCost}
                                    onChange={(e) => setTotalCost(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Calculation Card */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between gap-8">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-blue-600 mb-2 flex items-center gap-2">
                                <Info size={16} /> Rendimento (Porções)
                            </label>
                            <input
                                type="number" step="1"
                                placeholder="Ex: 20"
                                value={yieldAmount}
                                onChange={(e) => setYieldAmount(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-2">Quantos pratos/unidades isso rende?</p>
                        </div>

                        <div className="text-right">
                            <label className="block text-sm font-bold text-green-600 mb-1">CMV Unitário</label>
                            <div className="text-4xl font-black text-gray-800 tracking-tight">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(unitCmv)}
                            </div>
                            <span className="text-xs font-medium text-gray-400">Custo por porção utilizada</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 bg-main text-white font-bold rounded-xl hover:bg-main/90 transition-all shadow-lg shadow-main/20 disabled:opacity-70 disabled:shadow-none"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Mercadoria'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
