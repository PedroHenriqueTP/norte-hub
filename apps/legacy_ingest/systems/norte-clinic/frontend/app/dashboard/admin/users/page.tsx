"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
    id: number;
    email: string;
    role: string;
    is_active: boolean;
};

export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => api.get("/users").then(res => res.data), // Needs endpoint to list all users
    });

    const mutation = useMutation({
        mutationFn: ({ id, role }: { id: number; role: string }) => api.put(`/users/${id}/role`, { role }), // Needs endpoint
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Role atualizada com sucesso!");
        },
        onError: () => toast.error("Erro ao atualizar role."),
    });

    if (isLoading) return <div className="p-6"><Skeleton className="h-96 w-full" /></div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Usuários do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-4 text-left font-medium">ID</th>
                                    <th className="p-4 text-left font-medium">Email</th>
                                    <th className="p-4 text-left font-medium">Status</th>
                                    <th className="p-4 text-left font-medium">Permissão (Role)</th>
                                    <th className="p-4 text-left font-medium">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map(u => (
                                    <tr key={u.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4">{u.id}</td>
                                        <td className="p-4 font-medium">{u.email}</td>
                                        <td className="p-4">
                                            <Badge variant={u.is_active ? "default" : "secondary"}>
                                                {u.is_active ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Select
                                                defaultValue={u.role}
                                                onValueChange={(val) => mutation.mutate({ id: u.id, role: val })}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="doctor">Médico</SelectItem>
                                                    <SelectItem value="patient">Paciente</SelectItem>
                                                    <SelectItem value="secretary">Secretária</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-sm">
                                            {/* Add more actions like Disable/Edit */}
                                            ---
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
