"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ChevronLeft, Save, Loader2, Package, Info,
  Plus, Trash2, Calculator
} from 'lucide-react';
import Link from 'next/link';
import { useIngredients } from '../../../../../hooks/useIngredients';

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { ingredients: allIngredients, fetchIngredients } = useIngredients();

  const [activeTab, setActiveTab] = useState<'details' | 'recipe'>('details');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });

  const [recipeItems, setRecipeItems] = useState<any[]>([]);
  const [newIngredientId, setNewIngredientId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const fetchProduct = useCallback(async () => {
    if (!session?.accessToken || !params.id) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products/${params.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      if (!res.ok) throw new Error('Produto não encontrado');
      const data = await res.json();

      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        categoryId: data.categoryId || '',
        imageUrl: data.imageUrl || ''
      });

      if (data.recipes) {
        setRecipeItems(data.recipes.map((r: any) => ({
          ingredientId: r.ingredientId,
          ingredientName: r.ingredient.name,
          ingredientUnit: r.ingredient.unit,
          costPrice: Number(r.ingredient.costPrice),
          quantity: Number(r.quantity)
        })));
      }

    } catch (error) {
      console.error(error);
      alert('Erro ao carregar produto');
      router.push('/menu');
    } finally {
      setLoading(false);
    }
  }, [session, params.id, router]);

  useEffect(() => {
    fetchProduct();
    fetchIngredients();
  }, [fetchProduct, fetchIngredients]);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price.toString().replace(',', '.'))
        })
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredientId || !newQuantity) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/inventory/products/${params.id}/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          ingredientId: newIngredientId,
          quantity: parseFloat(newQuantity)
        })
      });

      if (!res.ok) throw new Error('Erro ao adicionar ingrediente');

      await fetchProduct();
      setNewIngredientId('');
      setNewQuantity('');
    } catch (error) {
      alert('Falha ao adicionar ingrediente à receita.');
    }
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    if (!confirm('Remover este ingrediente da receita?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/inventory/products/${params.id}/ingredients/${ingredientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      });

      if (!res.ok) throw new Error('Erro ao remover');
      await fetchProduct();
    } catch (error) {
      alert('Erro ao remover ingrediente');
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;

  const totalCost = recipeItems.reduce((acc, item) => acc + (item.costPrice * item.quantity), 0);
  const salePrice = parseFloat(formData.price.toString()) || 0;
  const cmvPercentage = salePrice > 0 ? (totalCost / salePrice) * 100 : 0;

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/menu" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-main">Editar Produto</h1>
          <p className="text-gray-500">{formData.name || 'Carregando...'}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'details' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Info size={18} /> Detalhes
        </button>
        <button
          onClick={() => setActiveTab('recipe')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'recipe' ? 'bg-white shadow-sm text-main' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Package size={18} /> Ficha Técnica
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <form onSubmit={handleSaveDetails} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  type="number" step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.categoryId || ''}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Sem categoria</option>
                  <option value="lanches">Lanches</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="sobremesas">Sobremesas</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main/20 resize-none"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button disabled={saving} className="btn btn-primary flex items-center gap-2">
                <Save size={18} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Custo Total (CMV Teórico)</p>
              <h3 className="text-2xl font-bold text-main">
                {totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Preço de Venda</p>
              <h3 className="text-2xl font-bold text-green-600">
                {salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Margem / Markup</p>
              <div className="flex items-center gap-2">
                <h3 className={`text-2xl font-bold ${cmvPercentage > 35 ? 'text-red-500' : 'text-blue-600'}`}>
                  {cmvPercentage.toFixed(1)}%
                </h3>
                <span className="text-xs text-gray-400">(CMV Ideal: &lt; 30-35%)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calculator size={20} /> Composição
            </h3>

            <div className="space-y-2 mb-6">
              {recipeItems.length === 0 ? (
                <p className="text-gray-400 py-4 text-center border-2 border-dashed rounded-xl">
                  Nenhum ingrediente adicionado à ficha técnica.
                </p>
              ) : (
                recipeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="font-bold text-main">{item.ingredientName}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} {item.ingredientUnit} x {item.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-gray-700">
                        {(item.quantity * item.costPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <button
                        onClick={() => handleRemoveIngredient(item.ingredientId)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-sm text-blue-800 mb-3">Adicionar Ingrediente</h4>
              <div className="flex gap-3">
                <div className="flex-1">
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={newIngredientId}
                    onChange={e => setNewIngredientId(e.target.value)}
                  >
                    <option value="">Selecione um ingrediente...</option>
                    {allIngredients.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.unit}) - Custo: {i.costPrice}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <input
                    type="number"
                    placeholder="Qtd."
                    step="0.001"
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={newQuantity}
                    onChange={e => setNewQuantity(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddIngredient}
                  disabled={!newIngredientId || !newQuantity}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} /> Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
