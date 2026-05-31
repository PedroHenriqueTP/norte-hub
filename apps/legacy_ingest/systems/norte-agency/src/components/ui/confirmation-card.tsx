"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ConfirmationCardProps {
    intent: string;
    data: any;
    summary: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export function ConfirmationCard({ intent, data, summary, onConfirm, onCancel }: ConfirmationCardProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md border-2 border-indigo-500/20 shadow-xl">
            <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                    🤖 AI Suggestion: <span className="font-bold text-indigo-600">{intent}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">{summary}</p>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm font-mono overflow-auto max-h-48">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel / Edit
                </Button>
                <Button onClick={handleConfirm} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Action"}
                </Button>
            </CardFooter>
        </Card>
    );
}
