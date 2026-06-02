"use client";

import { useState } from 'react';
import { Search, Plus, Edit2, Archive, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProducts, Product } from '../../../hooks/useProducts';
import { NewProductModal } from './components/new-product-modal';

export default function MenuPage() {
    const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const handleCreate = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleSave = async (data: any) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, data);
        } else {
            await createProduct(data);
        }
        return true;
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            await deleteProduct(id);
        }
    };

    // Filter logic placeholder - assume backend filtering or client side for MVP
    const filteredProducts = selectedCategory === 'Todos'
        ? products
        : products.filter(p => p.category?.name?.toLowerCase() === selectedCategory.toLowerCase());

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-main" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-main">Cardápio</h1>
                    <p className="text-text-muted">Gerencie categorias, itens e disponibilidade.</p>
                </div>

                {/* REPLACED BUTTON WITH MODAL COMPONENT */}
                <NewProductModal />
            </div>

            {/* Categories - Static for now, can be dynamic later */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {['Todos', 'Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Promoções'].map((cat, i) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-main text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        Nenhum produto encontrado nesta categoria.
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative h-48 bg-gray-100">
                                {/* Placeholder image logic */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                    <span className="text-4xl">🍔</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-main text-lg">{product.name}</h3>
                                    <span className="text-primary font-bold">
                                        {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
                                    {product.description || 'Sem descrição.'}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/menu/products/${product.id}`}
                                        className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit2 size={14} /> Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="py-2 px-3 bg-gray-50 text-gray-400 rounded-lg text-sm font-bold hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <Archive size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                product={editingProduct}
            /> 
            */}
        </div>
    );
}
