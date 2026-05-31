import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { UserHeader } from "@/components/UserHeader";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChatOverlay } from "@/components/ChatOverlay";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen relative">
            <div className="organic-bg">
                <div className="blob top-[-10%] left-[-10%]" />
                <div className="blob bottom-[-10%] right-[-10%] [animation-delay:2s]" />
            </div>
            <Sidebar className="sidebar-organic z-20 w-[320px] shrink-0 hidden md:flex" />
            <main className="flex-1 p-8 z-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto backdrop-blur-[2px]">
                    {children}
                </div>
            </main>

            {/* AI Co-Pilot Overlay */}
            <ChatOverlay />
        </div>
    );
}
