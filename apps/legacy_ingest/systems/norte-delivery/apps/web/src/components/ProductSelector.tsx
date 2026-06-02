import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';

interface ProductSelectorProps {
    onSelect: (product: Product, quantity: number, observation: string) => void;
}

export function ProductSelector({ onSelect }: ProductSelectorProps) {
    const { products, loading } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [observation, setObservation] = useState('');

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        if (selectedProduct) {
            onSelect(selectedProduct, quantity, observation);
            // Reset fields
            setSelectedProduct(null);
            setQuantity(1);
            setObservation('');
            setSearchTerm('');
        }
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Carregando produtos...</div>;

    return (
        <div className="space-y-4">
            {!selectedProduct ? (
                <>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Buscar produto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-lg divide-y divide-gray-100">
                        {filtered.map(product => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                            >
                                <span className="font-medium text-gray-700">{product.name}</span>
                                <span className="font-bold text-gray-900">
                                    {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="p-4 text-center text-gray-400 text-sm">Nenhum produto encontrado.</div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-900">{selectedProduct.name}</h4>
                            <p className="text-sm text-gray-500">Adicionar ao pedido</p>
                        </div>
                        <button onClick={() => setSelectedProduct(null)} className="text-xs text-red-500 font-medium hover:underline">Cancelar</button>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 block mb-1">Quantidade</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                        <div className="flex-[2]">
                            <label className="text-xs font-bold text-gray-500 block mb-1">Observação</label>
                            <input
                                type="text"
                                value={observation}
                                onChange={(e) => setObservation(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm"
                                placeholder="Ex: Sem cebola"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="w-full py-2 bg-main text-white rounded-lg font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Adicionar Item - {(Number(selectedProduct.price) * quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </button>
                </div>
            )}
        </div>
    );
}
