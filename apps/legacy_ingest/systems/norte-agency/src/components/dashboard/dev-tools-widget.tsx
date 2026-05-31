"use client";

import { createDummyClientAction, createDummyJobAction, createDummySupplierAction } from "@/actions/dev-tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, UserPlus, Truck, Briefcase } from "lucide-react";

export function DevToolsWidget() {
    return (
        <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-2 uppercase tracking-wider">
                    <Zap className="h-4 w-4" /> Ações Rápidas (Dev)
                </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
                <form action={createDummyClientAction}>
                    <Button size="sm" variant="outline" className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                        <UserPlus className="mr-2 h-3 w-3" /> +Cliente
                    </Button>
                </form>
                <form action={createDummySupplierAction}>
                    <Button size="sm" variant="outline" className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                        <Truck className="mr-2 h-3 w-3" /> +Fornecedor
                    </Button>
                </form>
                <form action={createDummyJobAction}>
                    <Button size="sm" variant="outline" className="bg-white border-amber-200 text-amber-900 hover:bg-amber-100">
                        <Briefcase className="mr-2 h-3 w-3" /> +Job
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
