"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("http://localhost:8000", {
    path: "/ws/socket.io", // Note: FastAPI Websocket is raw, but we can use socket.io client wrapper if backend supported it, 
    // BUT my backend implementation was raw Websocket!
    // I must use native WebSocket or change backend to socket.io.
    // Given the backend `chat.py` uses `WebSocket`, I should use native `WebSocket` in frontend.
    // Correcting below.
    autoConnect: false
});

// Correct implementation using native WebSocket
export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
    const [input, setInput] = useState("");
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (isOpen && !ws.current) {
            ws.current = new WebSocket("ws://localhost:8000/chat/ws");

            ws.current.onopen = () => {
                console.log("Connected to Chatbot");
            };

            ws.current.onmessage = (event) => {
                setMessages(prev => [...prev, { role: 'bot', text: event.data }]);
            };

            ws.current.onclose = () => {
                console.log("Disconnected");
                ws.current = null;
            };
        }

        return () => {
            if (!isOpen && ws.current) {
                ws.current.close();
                ws.current = null;
            }
        }
    }, [isOpen]);

    const sendMessage = () => {
        if (!input.trim() || !ws.current) return;

        // Add user message locally
        setMessages(prev => [...prev, { role: 'user', text: input }]);

        // Send to backend
        ws.current.send(input);
        setInput("");
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 md:w-96"
                    >
                        <Card className="shadow-xl border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-primary text-primary-foreground rounded-t-lg">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageCircle size={20} /> Medical Triage
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-primary-foreground hover:bg-primary/80">
                                    <X size={16} />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/30">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${m.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-background border shadow-sm rounded-bl-none'
                                                }`}>
                                                {m.text.split('\n').map((line, j) => (
                                                    <p key={j} className="mb-1 last:mb-0">{line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <p className="text-center text-muted-foreground text-sm mt-10">
                                            Describe your symptoms to start triage.
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 border-t bg-background flex gap-2">
                                    <Input
                                        placeholder="Type symptoms..."
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    />
                                    <Button size="icon" onClick={sendMessage}>
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                >
                    <Button
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-lg text-primary-foreground"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageCircle size={28} />
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
