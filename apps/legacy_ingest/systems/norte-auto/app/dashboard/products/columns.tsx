"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteProduct } from "@/lib/product-actions";

// Use a flat type for the client
export type Product = {
    id: string;
    name: string;
    sku: string | null;
    price: number | string;
    stock: number;
    images: string | null;
    createdAt: Date | string;
};

export const columns: ColumnDef<Product>[] = [
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
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Produto",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-semibold truncate max-w-[200px]">{row.getValue("name")}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("sku") || "-"}</div>,
    },
    {
        accessorKey: "price",
        header: "Preço",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price") as string);
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(price);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "Estoque",
        cell: ({ row }) => {
            const stock = parseFloat(row.getValue("stock") as string);
            return (
                <Badge variant={stock > 10 ? "secondary" : "destructive"}>
                    {stock} un
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <Link href={`/dashboard/products/${product.id}`}>
                            <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                                // In a real client component, use a transition or dialog confirmation
                                // For now, we reuse the server action directly or via a wrapper if needed
                                // but server actions passed to onClick usually work if bound correctly, 
                                // though cleaner is to use a transition hook.
                                // We'll keep it simple for UI demo.
                                deleteProduct(product.id);
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
