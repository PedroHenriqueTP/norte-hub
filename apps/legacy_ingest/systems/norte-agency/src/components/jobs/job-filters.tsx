"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface JobFiltersProps {
    clients: { id: string; name: string }[];
}

export function JobFilters({ clients }: JobFiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleClientChange = (clientId: string) => {
        const params = new URLSearchParams(searchParams);
        if (clientId && clientId !== "ALL") {
            params.set("clientId", clientId);
        } else {
            params.delete("clientId");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== "ALL") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Buscar por nome, ID ou descrição..."
                    className="pl-9 bg-slate-50 border-slate-200"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("query")?.toString()}
                />
            </div>
            <div className="w-full md:w-[200px]">
                <Select
                    onValueChange={handleClientChange}
                    defaultValue={searchParams.get("clientId")?.toString() || "ALL"}
                >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Todos os Clientes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Clientes</SelectItem>
                        {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full md:w-[200px]">
                <Select
                    onValueChange={handleStatusChange}
                    defaultValue={searchParams.get("status")?.toString() || "ALL"}
                >
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todos os Status</SelectItem>
                        <SelectItem value="QUOTATION_REQUESTED">Orçamento Pedido</SelectItem>
                        <SelectItem value="QUOTATION_APPROVED">Orçamento Aprovado</SelectItem>
                        <SelectItem value="IN_PROGRESS">Em Produção</SelectItem>
                        <SelectItem value="COMPLETED">Concluído</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
