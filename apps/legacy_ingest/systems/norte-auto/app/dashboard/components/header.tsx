"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNavContent } from "./sidenav";
import React from 'react';

export default function Header() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    // Breadcrumb Logic
    const breadcrumbs = paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const title = path.charAt(0).toUpperCase() + path.slice(1);

        return (
            <React.Fragment key={path}>
                <BreadcrumbItem>
                    {isLast ? (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
        );
    });

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shrink-0 z-30">
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[250px]">
                        <SideNavContent isCollapsed={false} isMobile />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Breadcrumbs (Desktop) */}
            <div className="hidden md:flex flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Global Search */}
            <div className="flex-1 md:flex-none md:w-64">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar produto, pedido..."
                        className="w-full bg-background shadow-none appearance-none pl-8 md:w-64 lg:w-80"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <NotificationBell />
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <span className="text-xl">🇧🇷</span> {/* Lang Flag */}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                <AvatarFallback>OS</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Perfil</DropdownMenuItem>
                        <DropdownMenuItem>Configurações</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Sair</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
