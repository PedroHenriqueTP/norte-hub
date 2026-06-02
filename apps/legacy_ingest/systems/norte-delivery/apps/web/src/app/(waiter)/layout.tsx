"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Bell, Menu, LogOut, UtensilsCrossed } from 'lucide-react';

export default function WaiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50 pb-20"> {/* pb-20 for bottom nav */}
            {/* Top Bar - Minimal */}
            <div className="bg-white px-4 py-3 shadow-sm flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-main text-white p-1.5 rounded-lg">
                        <UtensilsCrossed size={16} />
                    </div>
                    <span className="font-bold text-main">Garçom</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 truncate max-w-[100px]">{session?.user?.name || 'User'}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                        {/* Avatar Placeholder */}
                        <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-4">
                {children}
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 safe-area-bottom">
                <Link href="/waiter/tables" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${pathname?.includes('/waiter/tables') ? 'text-primary bg-primary/5' : 'text-gray-400'}`}>
                    <Home size={24} />
                    <span className="text-[10px] font-bold">Mesas</span>
                </Link>

                <Link href="/waiter/orders" className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${pathname?.includes('/waiter/orders') ? 'text-primary bg-primary/5' : 'text-gray-400'}`}>
                    <ClipboardList size={24} />
                    <span className="text-[10px] font-bold">Pedidos</span>
                </Link>

                <button className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
                    <Bell size={24} />
                    <span className="text-[10px] font-bold">Avisos</span>
                </button>

                <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-600">
                    <LogOut size={24} />
                    <span className="text-[10px] font-bold">Sair</span>
                </Link>
            </div>
        </div>
    );
}
