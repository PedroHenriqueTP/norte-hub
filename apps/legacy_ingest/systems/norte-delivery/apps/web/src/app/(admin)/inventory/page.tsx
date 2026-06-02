"use client";

import { useState } from 'react';
import { Package, Plus, TrendingUp, TrendingDown, AlertCircle, Search } from 'lucide-react';
import { useIngredients } from '../../../hooks/useIngredients';
import { NewIngredientModal } from './components/new-ingredient-modal';

export default function InventoryPage() {
    const { ingredients, loading, createIngredient, addStockMovement } = useIngredients();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

    // Movement Form State
    const [movement, setMovement] = useState({
        ingredientId: '',
        type: 'IN' as 'IN' | 'OUT' | 'LOSS',
        quantity: 0,
        cost: 0,
        description: ''
    });

    const handleCreate = async (data: any) => {
        try {
            await createIngredient(data);
            // Modal closes itself and ingredients refresh automatically via hook
        } catch (error) {
            alert('Erro ao criar ingrediente');
        }
    };

    const handleMovement = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addStockMovement({ ...movement });
            setIsMovementModalOpen(false);
            setMovement({ ingredientId: '', type: 'IN', quantity: 0, cost: 0, description: '' });
        } catch (error) {
            alert('Erro ao registrar movimentação');
        }
    };

    const openMovementModal = (ingredientId: string, type: 'IN' | 'OUT' | 'LOSS') => {
        setMovement({ ...movement, ingredientId, type, cost: 0 }); // Reset cost for new movement
        setIsMovementModalOpen(true);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
    );

    const totalStockValue = ingredients.reduce((acc, curr) => acc + (curr.costPrice * curr.currentStock), 0);

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-main">Controle de Estoque (CMV)</h1>
                    <p className="text-text-muted">Gestão estratégica de custos e mercadorias.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-main/20 hover:shadow-main/30 transition-all"
                >
                    <Plus size={20} /> Nova Mercadoria
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm mb-1 font-medium">Valor Total em Estoque</p>
                            <h3 className="text-3xl font-black text-gray-800">
                                {totalStockValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Package size={24} />
                        </div>
                    </div>
                </div>
                {/* Add more stats later */}
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <Search className="text-gray-400" size={20} />
                    <input
                        placeholder="Buscar mercadoria..."
                        className="flex-1 outline-none text-sm"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-sm md:text-base">
                            <tr>
                                <th className="p-6 font-bold text-gray-600">Mercadoria</th>
                                <th className="p-6 font-bold text-gray-600">Unidade</th>
                                <th className="p-6 font-bold text-gray-600">Custo Unitário (CMV)</th>
                                <th className="p-6 font-bold text-gray-600">Estoque Atual</th>
                                <th className="p-6 font-bold text-gray-600 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm md:text-base divide-y divide-gray-50">
                            {ingredients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        Nenhuma mercadoria cadastrada.
                                    </td>
                                </tr>
                            ) : (
                                ingredients.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6 font-bold text-gray-800">{item.name}</td>
                                        <td className="p-6 text-gray-600">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold">{item.unit}</span>
                                        </td>
                                        <td className="p-6 text-gray-600 font-medium">
                                            {item.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className={`p-6 font-bold ${item.currentStock <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            {item.currentStock.toLocaleString('pt-BR')} {item.unit}
                                        </td>
                                        <td className="p-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openMovementModal(item.id, 'IN')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip border border-transparent hover:border-green-100"
                                                    title="Registrar Compra"
                                                >
                                                    <TrendingUp size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openMovementModal(item.id, 'OUT')}
                                                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg tooltip border border-transparent hover:border-orange-100"
                                                    title="Registrar Uso"
                                                >
                                                    <TrendingDown size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openMovementModal(item.id, 'LOSS')}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg tooltip border border-transparent hover:border-red-100"
                                                    title="Registrar Perda"
                                                >
                                                    <AlertCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Modal */}
            <NewIngredientModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreate}
            />

            {/* Movement Modal (Simple) */}
            {isMovementModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                {movement.type === 'IN' ? 'Entrada de Estoque' : movement.type === 'OUT' ? 'Saída Manual' : 'Registrar Perda'}
                            </h2>
                            <button onClick={() => setIsMovementModalOpen(false)} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                        </div>
                        <form onSubmit={handleMovement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantidade ({ingredients.find(i => i.id === movement.ingredientId)?.unit})</label>
                                <input
                                    type="number" step="0.001" min="0.001"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20 outline-none"
                                    required
                                    value={movement.quantity}
                                    onChange={e => setMovement({ ...movement, quantity: parseFloat(e.target.value) })}
                                />
                            </div>
                            {movement.type === 'IN' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Custo Total da Compra (R$)</label>
                                    <input
                                        type="number" step="0.01" min="0"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20 outline-none"
                                        required
                                        value={movement.cost}
                                        onChange={e => setMovement({ ...movement, cost: parseFloat(e.target.value) })}
                                    />
                                </div>
                            )}
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20 outline-none"
                                value={movement.description}
                                onChange={e => setMovement({ ...movement, description: e.target.value })}
                                placeholder="Motivo / Descrição"
                            />
                            <button className={`w-full btn ${movement.type === 'LOSS' ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'} text-white mt-4`}>
                                Confirmar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
