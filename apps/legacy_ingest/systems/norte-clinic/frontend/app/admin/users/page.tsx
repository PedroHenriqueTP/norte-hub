"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { MoreHorizontal, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/?skip=0&limit=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            const token = localStorage.getItem('token');
            return axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            setIsEditOpen(false);
            setSelectedUser(null);
        },
        onError: () => alert("Erro ao atualizar usuário.")
    });

    const handleRoleChange = (userId: number, newRole: string) => {
        updateMutation.mutate({ id: userId, data: { role: newRole } });
    };

    const handleStatusToggle = (userId: number, currentStatus: boolean) => {
        updateMutation.mutate({ id: userId, data: { is_active: !currentStatus } });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
                <Button>Adicionar Usuário</Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : users?.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.full_name || "Sem Nome"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {user.role === 'admin' && <ShieldAlert className="h-4 w-4 text-red-500" />}
                                        {user.role === 'doctor' && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                                        {user.role === 'secretary' && <Shield className="h-4 w-4 text-blue-500" />}
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.is_active ? "default" : "destructive"}>
                                        {user.is_active ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}>
                                                Editar Detalhes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'doctor' : 'admin')}>
                                                {user.role === 'admin' ? 'Remover Admin' : 'Promover a Admin'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusToggle(user.id, user.is_active)}>
                                                {user.is_active ? 'Desativar Acesso' : 'Reativar Acesso'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Nome</Label>
                                <Input defaultValue={selectedUser.full_name} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Função</Label>
                                <Select
                                    defaultValue={selectedUser.role}
                                    onValueChange={(val) => handleRoleChange(selectedUser.id, val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="doctor">Médico</SelectItem>
                                        <SelectItem value="secretary">Secretária</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
