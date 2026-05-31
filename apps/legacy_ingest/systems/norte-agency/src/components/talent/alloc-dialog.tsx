"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { allocateFreelancer } from "@/actions/allocation";
import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? "Allocating..." : "Confirm Allocation"}</Button>;
}

export function AllocDialog({ freelancerId, freelancerName, jobs }: { freelancerId: string, freelancerName: string, jobs: any[] }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(allocateFreelancer, null);

    useEffect(() => {
        if (state?.message === "success") setOpen(false);
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="default">Allocate to Job</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Allocate {freelancerName}</DialogTitle>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <input type="hidden" name="freelancerId" value={freelancerId} />

                    <div className="grid gap-2">
                        <Label>Select Job</Label>
                        <select name="jobId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                            {jobs.map(j => (
                                <option key={j.id} value={j.id}>{j.title} ({j.client.name})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <Input name="role" placeholder="e.g. Senior Designer" required />
                    </div>

                    <div className="grid gap-2">
                        <Label>Daily/Hourly Rate</Label>
                        <Input name="rate" type="number" placeholder="500" required />
                    </div>

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
