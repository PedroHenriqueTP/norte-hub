"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTransaction } from "@/actions/transactions";
import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";

const initialState = {
    message: "",
    errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Transaction"}
        </Button>
    );
}

export interface TransactionDraft {
    description?: string;
    amount?: number;
    type?: "INCOME" | "EXPENSE";
    category?: "PRODUCTION" | "LOGISTICS" | "TALENT" | "MARKETING" | "TAXES" | "OTHER";
    date?: string;
}

export function AddTransactionDialog({ jobId, initialData, triggerLabel }: { jobId: string, initialData?: TransactionDraft, triggerLabel?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(createTransaction, initialState as any);

    useEffect(() => {
        if (state?.message === "success") {
            setOpen(false);
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={initialData ? "secondary" : "default"}>
                    {triggerLabel || "+ Add Transaction"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Review and save this AI-drafted transaction." : "Manually record an expense or income for this job."}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="grid gap-4 py-4">
                    <input type="hidden" name="jobId" value={jobId} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <select name="type" defaultValue={initialData?.type || "EXPENSE"} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Input id="description" name="description" defaultValue={initialData?.description} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initialData?.amount} className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <select name="category" defaultValue={initialData?.category || "OTHER"} className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="PRODUCTION">Production</option>
                            <option value="LOGISTICS">Logistics</option>
                            <option value="TALENT">Talent</option>
                            <option value="MARKETING">Marketing</option>
                            <option value="TAXES">Taxes</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input id="date" name="date" type="date" className="col-span-3" required defaultValue={initialData?.date || new Date().toISOString().split('T')[0]} />
                    </div>

                    {state?.message && state.message !== "success" && (
                        <div className="text-red-500 text-sm text-center">{state.message}</div>
                    )}

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
