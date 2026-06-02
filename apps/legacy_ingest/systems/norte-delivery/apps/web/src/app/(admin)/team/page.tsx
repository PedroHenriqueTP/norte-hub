"use client";

import { useState } from 'react';
import { Plus, Trash2, Mail, Shield, User } from 'lucide-react';

export default function TeamPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([
        { id: 1, name: 'Roberta Santos', email: 'roberta@bistro55.com', role: 'Gerente' },
        { id: 2, name: 'Carlos Oliveira', email: 'carlos@bistro55.com', role: 'Chef' },
        { id: 3, name: 'Ana Silva', email: 'ana@bistro55.com', role: 'Garçom' }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Garçom'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would call the API -> POST /users
        // const res = await fetch('/api/users', ...)

        // Simulating success
        setEmployees([...employees, {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            role: formData.role
        }]);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'Garçom' });
        alert('Funcionário cadastrado com sucesso!');
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-main">Gestão de Equipe</h1>
                    <p className="text-text-muted">Gerencie quem tem acesso ao sistema</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="w-5 h-5" />
                    Novo Funcionário
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Função</th>
                            <th className="p-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-6 font-medium text-main flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {employee.name.charAt(0)}
                                    </div>
                                    {employee.name}
                                </td>
                                <td className="p-6 text-gray-600">{employee.email}</td>
                                <td className="p-6">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                        {employee.role}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {employees.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        Nenhum funcionário cadastrado.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-6">Novo Funcionário</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Nome Completo</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="Ex: Ana Silva"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Email de Acesso</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="email@restaurante.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Senha Provisória</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Permissão</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Garçom">Garçom</option>
                                    <option value="Cozinha">Cozinha</option>
                                    <option value="Gerente">Gerente</option>
                                    <option value="Caixa">Caixa</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors"
                                >
                                    Cadastrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
