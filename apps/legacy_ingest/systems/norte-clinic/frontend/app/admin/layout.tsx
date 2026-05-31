"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { UserHeader } from "@/components/UserHeader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token");
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        retry: 1
    });

    useEffect(() => {
        if (!isLoading && (isError || !user)) {
            router.push('/');
        } else if (!isLoading && user && user.role !== 'admin') {
            alert("Acesso Negado: Apenas administradores podem ver esta página.");
            router.push('/dashboard');
        }
    }, [user, isLoading, isError, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-2">Verificando permissões...</span>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return null; // Or a generic 403 Access Denied component
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[288px_1fr]">
            <AdminSidebar />
            <div className="flex flex-col bg-slate-50 dark:bg-slate-950">
                <div className="bg-slate-900 border-b border-slate-800">
                    <UserHeader />
                </div>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
