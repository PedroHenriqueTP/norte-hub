"use client";

import { useState } from 'react';
import {
    X, UploadCloud, CalendarIcon,
    ArrowUpCircle, ArrowDownCircle, Check, DollarSign
} from 'lucide-react';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

export function NewTransactionModal({ isOpen, onClose, onSave }: NewTransactionModalProps) {
    const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // For now passing file as mock URL since we don't have proper upload backend yet in this context
            // In real app, upload file first, get URL, then save transaction
            const mockAttachmentUrl = file ? `https://storage.example.com/${file.name}` : undefined;

            await onSave({
                type,
                amount: parseFloat(amount),
                description,
                category,
                paymentMethod,
                occurredAt: date,
                attachmentUrl: mockAttachmentUrl
            });
            onClose();
            // Reset
            setAmount('');
            setDescription('');
            setCategory('');
            setDate('');
            setFile(null);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Lançar Movimentação</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Type Toggle */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setType('INCOME')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ArrowUpCircle size={18} /> Entrada (Receita)
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('EXPENSE')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <ArrowDownCircle size={18} /> Saída (Despesa)
                        </button>
                    </div>

                    {/* Amount & Date */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Valor (R$)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number" step="0.01"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all font-bold text-lg"
                                    placeholder="0,00"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Data da Ocorrência</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all text-gray-600 font-medium"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description & Category */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Descrição</label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all"
                                placeholder="Ex: Compra de embalagens..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Categoria</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all bg-white"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="OPERATIONAL">Operacional</option>
                                    <option value="MARKETING">Marketing</option>
                                    <option value="PERSONNEL">Pessoal/Salários</option>
                                    <option value="OCCUPANCY">Aluguel/Contas</option>
                                    <option value="SUPPLIES">Insumos</option>
                                    <option value="SALES">Vendas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Meio de Pagamento</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-main focus:ring-4 focus:ring-main/10 outline-none transition-all bg-white"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="PIX">Pix</option>
                                    <option value="CREDIT_CARD">Crédito</option>
                                    <option value="DEBIT_CARD">Débito</option>
                                    <option value="CASH">Dinheiro</option>
                                    <option value="VOUCHER">Voucher</option>
                                    <option value="BOLETO">Boleto Bancário</option>
                                    <option value="BANK_TRANSFER">Transferência Bancária</option>
                                    <option value="OTHER">Outros</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                            {file ? file.name : "Clique para anexar comprovante"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, PNG ou JPG até 5MB</p>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-70 ${type === 'INCOME'
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                }`}
                        >
                            {isSubmitting ? 'Salvando...' : (type === 'INCOME' ? 'Confirmar Entrada' : 'Confirmar Saída')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
