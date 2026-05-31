"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { addJobItemAction, updateJobItemAction, deleteJobItemAction } from "@/actions/jobs";
import { JobItemDialog } from "./job-item-dialog";

interface JobItem {
    id: string;
    title: string;
    description: string | null;
    quantity: number;
    unitPrice: any; // Decimal
    unitCost: any; // Decimal
    status: string;
    producedById?: string | null;
}

interface JobItemManagerProps {
    jobId: string;
    items: JobItem[];
    canEdit: boolean;
    users?: { id: string; name: string | null; email: string }[]; // For producer assignment
}

export function JobItemManager({ jobId, items, canEdit, users = [] }: JobItemManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
    const [selectedItem, setSelectedItem] = useState<JobItem | undefined>(undefined);

    async function handleAddItem(data: any) {
        await addJobItemAction(jobId, data);
    }

    async function handleUpdateItem(data: any) {
        if (!selectedItem) return;
        await updateJobItemAction(selectedItem.id, data);
    }

    async function handleDelete(id: string) {
        if (!confirm("Tem certeza que deseja remover este item?")) return;
        try {
            await deleteJobItemAction(id);
        } catch (error) {
            console.error(error);
            alert("Erro ao remover item");
        }
    }

    function openAddDialog() {
        setDialogMode("add");
        setSelectedItem(undefined);
        setIsDialogOpen(true);
    }

    function openEditDialog(item: JobItem) {
        setDialogMode("edit");
        setSelectedItem(item);
        setIsDialogOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-4 pt-4">
                <h3 className="text-lg font-medium text-slate-800 hidden">Itens</h3>
                {canEdit && (
                    <Button onClick={openAddDialog} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white ml-auto">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Item
                    </Button>
                )}
            </div>

            <div className="rounded-none border-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50 border-y border-slate-100">
                            <TableHead className="w-[30%] pl-6">Nome / Descrição</TableHead>
                            <TableHead className="text-center">Qtd</TableHead>
                            <TableHead className="text-right text-blue-600">Preço (Cli)</TableHead>
                            <TableHead className="text-right text-red-600">Custo</TableHead>
                            <TableHead className="text-right text-green-600">Lucro</TableHead>
                            <TableHead>Resp.</TableHead>
                            {canEdit && <TableHead className="w-[100px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(items || []).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                                    Nenhum item adicionado ao orçamento.
                                </TableCell>
                            </TableRow>
                        ) : (
                            (items || []).map((item) => {
                                const totalRevenue = Number(item.quantity) * Number(item.unitPrice);
                                const totalCost = Number(item.quantity) * Number(item.unitCost || 0);
                                const profit = totalRevenue - totalCost;

                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                                        <TableCell className="pl-6 font-medium text-slate-700">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-900">{item.title || "Item Sem Nome"}</span>
                                                {item.description && <span className="text-xs text-slate-500">{item.description}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-medium text-blue-700">
                                            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600 text-xs">
                                            R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-green-600 text-xs">
                                            R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            {item.producedById ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold">
                                                        {users.find(u => u.id === item.producedById)?.name?.substring(0, 2).toUpperCase() || "U"}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic text-xs">--</span>
                                            )}
                                        </TableCell>
                                        {canEdit && (
                                            <TableCell>
                                                <div className="flex justify-end gap-1 px-2">
                                                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)} className="h-8 w-8 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <JobItemDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                initialData={selectedItem}
                users={users}
                onSubmit={dialogMode === "add" ? handleAddItem : handleUpdateItem}
            />
        </div>
    );
}
