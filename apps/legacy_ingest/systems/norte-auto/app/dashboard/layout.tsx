"use client";

import { SideNavContent } from '@/app/dashboard/components/sidenav';
import Header from '@/app/dashboard/components/header';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SessionProvider } from 'next-auth/react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <SessionProvider>
            <div className="flex min-h-screen w-full bg-muted/40">
                {/* Desktop Sidebar */}
                <aside
                    className={cn(
                        "hidden border-r bg-background md:flex flex-col transition-all duration-300 ease-in-out relative z-40",
                        isCollapsed ? "w-[60px]" : "w-[250px]"
                    )}
                >
                    <div className="flex justify-end p-2 absolute -right-3 top-4 z-50">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full shadow-md bg-background"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
                        </Button>
                    </div>

                    <SideNavContent isCollapsed={isCollapsed} />
                </aside>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                </div>
            </div>
        </SessionProvider>
    );
}
