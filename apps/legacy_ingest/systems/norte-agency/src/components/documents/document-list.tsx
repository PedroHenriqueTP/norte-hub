"use client";

import { deleteDocument } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";

interface DocumentListProps {
    documents: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
    }[];
}

export function DocumentList({ documents }: DocumentListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        setIsDeleting(id);
        await deleteDocument(id);
        setIsDeleting(null);
    }

    if (!documents || documents.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                No documents uploaded yet.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                            >
                                <a href={doc.url} target="_blank" rel="noreferrer">
                                    <span className="sr-only">Open</span>
                                </a>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10"
                                disabled={isDeleting === doc.id}
                                onClick={() => handleDelete(doc.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
