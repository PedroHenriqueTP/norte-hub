"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShoppingBag } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export type Order = {
    id: string;
    customer: string;
    total: number;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    channel: string;
    createdAt: string;
};

// Helper for badges
const getStatusValues = (status: string) => {
    switch (status) {
        case 'pending': return { label: 'Pendente', color: 'bg-yellow-500 hover:bg-yellow-600' }; // Tailwind classes or map to "destructive"/"default" variants if configured
        case 'paid': return { label: 'A Enviar', color: 'bg-blue-500 hover:bg-blue-600' };
        case 'shipped': return { label: 'Enviado', color: 'bg-purple-500 hover:bg-purple-600' };
        case 'delivered': return { label: 'Entregue', color: 'bg-green-500 hover:bg-green-600' };
        case 'cancelled': return { label: 'Cancelado', color: 'bg-red-500 hover:bg-red-600' };
        default: return { label: status, color: 'bg-gray-500' };
    }
}

export const columns: ColumnDef<Order>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                onClick={(e) => e.stopPropagation()} // Prevent row click
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue("id")}</span>,
    },
    {
        accessorKey: "customer",
        header: "Cliente",
        cell: ({ row }) => <span className="font-medium">{row.getValue("customer")}</span>,
    },
    {
        accessorKey: "channel",
        header: "Canal",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs">
                {/* Icon could go here */}
                {row.getValue("channel")}
            </Badge>
        ),
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(row.getValue("total"))}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const { label, color } = getStatusValues(row.getValue("status"));
            // Custom coloring via className since Badge variants are limited in standard Shadcn
            return (
                <Badge className={`${color} text-white border-0`}>
                    {label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => <span className="text-muted-foreground text-xs">{new Date(row.getValue("createdAt") as string).toLocaleDateString()}</span>,
    },
];
