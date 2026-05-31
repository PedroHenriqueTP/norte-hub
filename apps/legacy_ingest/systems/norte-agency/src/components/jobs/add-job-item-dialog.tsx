"use client";

import { createJobItem } from "@/actions/job-items";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Adding..." : "Add Item"}
        </Button>
    );
}

export function AddJobItemDialog({ jobId }: { jobId: string }) {
    const [open, setOpen] = useState(false);

    async function clientAction(formData: FormData) {
        const description = formData.get("description") as string;
        const quantity = Number(formData.get("quantity"));
        const unitPrice = Number(formData.get("unitPrice"));
        const unitCost = Number(formData.get("unitCost"));

        const res = await createJobItem({
            jobId,
            description,
            quantity,
            unitPrice,
            unitCost
        });

        if (res?.message === "success") {
            setOpen(false);
        } else {
            alert("Error: " + res?.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Budget Item</DialogTitle>
                </DialogHeader>
                <form action={clientAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input name="description" required placeholder="e.g. Video Editing" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Qty</Label>
                            <Input name="quantity" type="number" defaultValue="1" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Client Price</Label>
                            <Input name="unitPrice" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                        <div className="space-y-2">
                            <Label>Internal Cost</Label>
                            <Input name="unitCost" type="number" step="0.01" required placeholder="0.00" />
                        </div>
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
