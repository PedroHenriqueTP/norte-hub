"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedCount = table.getFilteredSelectedRowModel().rows.length;

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Filtrar produtos..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto hidden md:flex">
                                <SlidersHorizontal className="mr-2 h-4 w-4" /> Colunas
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/dashboard/products/new">
                        <Button>Novo +</Button>
                    </Link>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="rounded-md border bg-white hidden md:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Nenhum resultado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        // Type assertion safe here because we know our columns logic
                        // but standard way is `row.original` typed via Generic TData
                        const product = row.original as any;

                        return (
                            <div key={row.id} className="flex flex-col rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-semibold text-lg">{product.name}</div>
                                    <Badge variant={product.stock > 10 ? "secondary" : "destructive"}>
                                        {product.stock} un
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <span>SKU: {product.sku || '-'}</span>
                                        <span className="font-medium text-foreground text-base">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(product.price))}
                                        </span>
                                    </div>
                                    <Link href={`/dashboard/products/${product.id}`}>
                                        <Button size="sm" variant="outline">Editar</Button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Próximo
                </Button>
            </div>

            {/* Floating Bulk Actions Bar */}
            {selectedCount > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4 rounded-full border bg-zinc-900 px-6 py-3 text-white shadow-xl">
                        <span className="text-sm font-medium">{selectedCount} selecionado(s)</span>
                        <div className="h-4 w-px bg-zinc-700" />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-white hover:text-zinc-300"
                            onClick={() => console.log("Bulk Sync trigger")}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" /> Sincronizar
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-red-400 hover:text-red-300 hover:bg-transparent"
                            onClick={() => console.log("Bulk Delete trigger")}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
