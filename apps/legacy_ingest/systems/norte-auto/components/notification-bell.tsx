"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { fetchNotifications, markAsRead } from "@/lib/notification-actions";
import { useRouter } from "next/navigation";

// Define locally to avoid heavy Prisma import in client (or use shared type)
type NotificationMock = {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    type: string;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationMock[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Polling or fetch on mount
        const load = async () => {
            const data = await fetchNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        };
        load();
        const interval = setInterval(load, 30000); // 30s poll
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        await markAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px] bg-red-600">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notificações</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-auto px-2 text-xs text-blue-600">
                            Ler todas
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        Nenhuma notificação nova.
                    </div>
                ) : (
                    notifications.map((item) => (
                        <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-1 p-3 cursor-default focus:bg-transparent">
                            <div className="flex w-full justify-between items-start">
                                <span className={`font-semibold text-sm ${!item.read ? 'text-blue-700' : ''}`}>{item.title}</span>
                                {!item.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                            <span className="text-[10px] text-slate-400 w-full text-right mt-1">
                                {new Date(item.createdAt).toLocaleTimeString()}
                            </span>
                        </DropdownMenuItem>
                    ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs cursor-pointer">
                    Ver histórico completo
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
