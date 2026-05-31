"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateAIContent } from "@/lib/product-actions";
import { toast } from "sonner"; // Assuming sonner is installed or will use basic alert

interface MagicCopyButtonProps {
    onGenerate: (content: string) => void;
}

export function MagicCopyButton({ onGenerate }: MagicCopyButtonProps) {
    const [open, setOpen] = useState(false);
    const [features, setFeatures] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!features) return;
        setLoading(true);
        setError("");

        try {
            const content = await generateAIContent(features);
            if (content) {
                onGenerate(content);
                setOpen(false);
                setFeatures("");
            }
        } catch (err: any) {
            setError(err.message || "Erro ao gerar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    <Wand2 className="h-4 w-4" />
                    Gerar com IA
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Magic Copywriter ✨</DialogTitle>
                    <DialogDescription>
                        Descreva as características principais do produto (ex: cor, material, benefícios).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Ex: Tênis de corrida vermelho, amortecimento em gel, ideal para maratonas."
                        value={features}
                        onChange={(e) => setFeatures(e.target.value)}
                        className="h-32"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={loading || !features}>
                        {loading ? "Escrevendo..." : "Gerar Descrição"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
