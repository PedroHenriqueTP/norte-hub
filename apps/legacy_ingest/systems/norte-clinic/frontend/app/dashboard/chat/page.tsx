"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

type Chat = {
    id: number;
    name: string;
    phone: string;
    lastMsg: string;
    unread: number;
};

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [message, setMessage] = useState("");

    // Mock conversas (substitua por query real que busque do backend)
    const chats: Chat[] = [
        { id: 1, name: "Maria Silva", phone: "5511999999999", lastMsg: "Oi doutor, marquei consulta", unread: 2 },
        { id: 2, name: "João Santos", phone: "5511988888888", lastMsg: "Obrigado pela receita", unread: 0 },
    ];

    const sendMessage = async () => {
        if (!message.trim() || !selectedChat) return;

        try {
            await api.post("/whatsapp/send", {
                to: selectedChat.phone,
                text: message
            });
            // In real app, optimistic update or invalidate query
            console.log("Sent", message);
            setMessage("");
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-card border rounded-lg overflow-hidden">
            {/* Sidebar Conversas */}
            <div className="w-80 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar conversas..." className="pl-8" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${selectedChat?.id === chat.id ? "bg-muted" : ""}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-medium truncate">{chat.name}</p>
                                {chat.unread > 0 && <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">{chat.unread}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMsg}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Área de Chat */}
            <div className="flex-1 flex flex-col bg-background">
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-border bg-card flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h2 className="font-semibold text-lg">{selectedChat.name}</h2>
                                <p className="text-xs text-muted-foreground">{selectedChat.phone}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {/* Mock Message Bubbles */}
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                                    {selectedChat.lastMsg}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] text-sm">
                                    Ok, confirmado!
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-card flex gap-2">
                            <Input
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                onKeyDown={e => e.key === "Enter" && sendMessage()}
                                className="flex-1"
                            />
                            <Button onClick={sendMessage} size="icon">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                        <div className="bg-muted/50 p-6 rounded-full mb-4">
                            <Send className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">Selecione uma conversa</h3>
                        <p className="text-sm">Escolha um paciente para iniciar o atendimento via WhatsApp.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
