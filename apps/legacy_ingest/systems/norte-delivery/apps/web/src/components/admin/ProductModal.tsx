import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Product } from '../../hooks/useProducts';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<boolean>;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId || '',
        imageUrl: product.imageUrl || ''
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: ''
      });
      setImagePreview(null);
    }
  }, [product, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/api/systems/norte-bar/upload`, {
        method: 'POST',
        body: formDataUpload
      });
      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...formData,
        price: parseFloat(formData.price.toString().replace(',', '.'))
      });
      onClose();
    } catch (error: any) {
      alert(`Erro: ${error.message || 'Erro desconhecido ao salvar'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
              placeholder="Ex: X-Burger Premium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all"
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
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-main focus:ring-2 focus:ring-main/20 outline-none transition-all resize-none"
              placeholder="Descreva os ingredientes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-main/10 file:text-main
                  hover:file:bg-main/20
                  "
                />
                {isUploading && <p className="text-xs text-gray-500 mt-1">Enviando imagem...</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-main text-white font-bold rounded-lg hover:bg-main/90 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              <Save size={18} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
