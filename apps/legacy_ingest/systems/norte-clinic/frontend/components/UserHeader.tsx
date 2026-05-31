"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function UserHeader() {
    const router = useRouter();

    const { data: user } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        retry: false
    });

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const getInitials = (name: string) => {
        return name ? name.substring(0, 2).toUpperCase() : "US";
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'secretary': return 'Secretária';
            case 'doctor': return 'Médico';
            default: return 'Usuário';
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6 shadow-sm">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Painel Médico</h1>
                <p className="text-xs text-muted-foreground">
                    Bem-vindo, {user?.full_name?.split(' ')[0] || 'Doutor(a)'}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user?.profile_image} alt={user?.full_name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {getInitials(user?.full_name || "")}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.full_name || 'Carregando...'}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email} • {getRoleLabel(user?.role || "")}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:text-red-600">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
