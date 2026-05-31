"use client";

import { FormEvent, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Sparkles } from "lucide-react";
import { AddTransactionDialog, TransactionDraft } from "@/components/finance/add-transaction-dialog";

export function CopilotChat() {
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),
    });
    const [input, setInput] = useState("");
    const isLoading = status === "submitted" || status === "streaming";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const message = input.trim();
        if (!message) return;

        await sendMessage({ text: message });
        setInput("");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg border border-primary/20 bg-background text-primary hover:bg-primary/10 w-12 h-12"
                >
                    <Sparkles className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" /> Agency Copilot
                    </SheetTitle>
                    <SheetDescription>
                        Ask me to search jobs, add expenses, or find talent.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 pr-4 mt-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground mt-8">
                                Try "Add a $500 expense for Marketing to the Coca-Cola job"
                            </div>
                        )}

                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${m.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                        }`}
                                >
                                    {m.parts
                                        .filter((part) => part.type === "text")
                                        .map((part, index) => (
                                            <p key={`${m.id}-text-${index}`}>{part.text}</p>
                                        ))}

                                    {/* Tool Invocations Handling */}
                                    {m.parts
                                        .filter((part) => part.type === "dynamic-tool" || part.type.startsWith("tool-"))
                                        .map((toolPart) => {
                                        const part = toolPart as any;
                                        const toolName =
                                            part.type === "dynamic-tool"
                                                ? part.toolName
                                                : part.type.replace("tool-", "");
                                        const toolCallId = part.toolCallId;
                                        const args = part.input;

                                        if (toolName === "draft_transaction") {
                                            const draft = args as (TransactionDraft & { jobId?: string }) | undefined;
                                            if (!draft?.jobId) return null;

                                            return (
                                                <div key={toolCallId} className="mt-2 p-2 bg-background rounded border">
                                                    <p className="text-xs font-semibold mb-2">Draft Created:</p>
                                                    <AddTransactionDialog
                                                        jobId={draft.jobId}
                                                        initialData={draft}
                                                        triggerLabel="Review & Save Transaction"
                                                    />
                                                </div>
                                            );
                                        }
                                        if (toolName === "search_jobs") {
                                            if (part.state === "output-available") {
                                                const rawOutput = part.output;
                                                const jobs = typeof rawOutput === "string" ? JSON.parse(rawOutput) : rawOutput;
                                                return (
                                                    <div key={toolCallId} className="mt-2 text-xs text-muted-foreground bg-background p-2 rounded border">
                                                        Found {Array.isArray(jobs) ? jobs.length : 0} jobs.
                                                    </div>
                                                )
                                            }
                                            return <div key={toolCallId} className="text-xs animate-pulse">Searching...</div>
                                        }

                                        if (toolName === "query_financials") {
                                            if (part.state === "output-available") {
                                                const rawOutput = part.output;
                                                const data = (typeof rawOutput === "string"
                                                    ? JSON.parse(rawOutput)
                                                    : rawOutput) as { total?: number; currency?: string; count?: number };
                                                return (
                                                    <div key={toolCallId} className="mt-2 p-3 bg-card rounded border flex justify-between items-center">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Financial Result</p>
                                                            <div className="text-lg font-bold text-primary">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: data.currency ?? "BRL" }).format(data.total ?? 0)}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {data.count ?? 0} transactions
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return <div key={toolCallId} className="text-xs animate-pulse">Calculating...</div>
                                        }

                                        return null;
                                    })}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-lg px-4 py-2 text-sm">Thinking...</div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex items-center gap-2 border-t pt-4"
                >
                    <Input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Type your instruction..."
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
