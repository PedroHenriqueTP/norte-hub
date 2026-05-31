"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, Minimize2, Sparkles, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    type?: "text" | "command-result";
};

export function ChatOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Olá, Dr. Gabriel. Sou seu Co-Piloto. Posso ajudar a navegar, resumir prontuários ou agendar retornos."
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");

        // Mock AI Response
        setTimeout(() => {
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Entendido. (Simulação: Comando processado...)"
            };
            setMessages(prev => [...prev, responseMsg]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <>
            {/* Trigger Button - Positioned to the left of the potential Page FAB */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-8 right-32 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full bg-slate-900/90 text-white shadow-lg hover:bg-slate-800 hover:scale-110 transition-all border border-slate-700"
                        >
                            <Sparkles className="h-6 w-6 text-teal-400" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-8 right-8 z-[60] w-[380px] md:w-[450px] h-[600px] max-h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/70 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-white/50 border-b border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-inner">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">MedCura Co-Pilot</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Online & Pronto
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-slate-200/50 rounded-full"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Minimize2 className="h-4 w-4 text-slate-500" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30" ref={scrollRef}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm",
                                        msg.role === "assistant"
                                            ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                            : "bg-blue-600 text-white ml-auto rounded-tr-none"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        {/* Command Suggestions */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-right">
                            {['Resumir Paciente', 'Agenda do Dia', 'Novo Prontuário'].map((cmd) => (
                                <button
                                    key={cmd}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white/60 hover:bg-white text-xs font-medium text-slate-600 rounded-full border border-slate-200 transition-colors flex items-center gap-1"
                                    onClick={() => setInputValue(cmd)}
                                >
                                    <Command className="w-3 h-3 text-slate-400" />
                                    {cmd}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/60 border-t border-white/40">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Digite um comando..."
                                    className="pr-10 h-12 bg-white/80 border-slate-200 rounded-xl focus-visible:ring-blue-500/30 font-medium placeholder:text-slate-400"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-14 top-1 h-10 w-10 text-slate-400 hover:text-blue-500 hover:bg-transparent"
                                >
                                    <Mic className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
                                    onClick={handleSend}
                                >
                                    <Send className="h-5 w-5 text-white" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
