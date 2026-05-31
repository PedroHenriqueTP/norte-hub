"use client";

import { uploadDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                </>
            ) : (
                <>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Document
                </>
            )}
        </Button>
    )
}

export function UploadDocument({ jobId }: { jobId: string }) {
    const [message, setMessage] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        formData.append("jobId", jobId);

        const result = await uploadDocument(formData);

        if (result?.message === "success") {
            setMessage("Upload successful!");
            setTimeout(() => setMessage(null), 3000);
            // Reset form logic would go here if we had a ref
        } else {
            setMessage(result?.message || "Upload failed");
        }
    }

    return (
        <form action={clientAction} className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="space-y-2">
                <Label htmlFor="file">Add New Document</Label>
                <Input id="file" name="file" type="file" required />
            </div>
            <SubmitButton />
            {message && (
                <p className={`text-xs ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}
        </form>
    );
}
