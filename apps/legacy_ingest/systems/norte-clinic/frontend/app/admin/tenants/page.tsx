"use client";

import { TenantManagementTable } from "@/components/admin/tenant-management-table";

// Mock Data for visualization
const MOCK_TENANTS = [
    { id: "tenant_001", name: "Clínica Vida Saudável", plan: "Enterprise", isActive: true, mrr: 1500.00, storageUsed: 450, storageLimit: 1000 },
    { id: "tenant_002", name: "Dr. João Cardio", plan: "Professional", isActive: true, mrr: 850.00, storageUsed: 120, storageLimit: 500 },
    { id: "tenant_003", name: "Pediatria Feliz", plan: "Professional", isActive: false, mrr: 850.00, storageUsed: 480, storageLimit: 500 },
    { id: "tenant_004", name: "Centro Ortopédico", plan: "Enterprise", isActive: true, mrr: 2100.00, storageUsed: 890, storageLimit: 2000 },
    { id: "tenant_005", name: "Dra. Ana Dermato", plan: "Basic", isActive: true, mrr: 350.00, storageUsed: 50, storageLimit: 200 },
];

export default function TenantsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Gestão de Tenants</h1>
                    <p className="text-slate-500 font-medium mt-2">Visão geral da base de clientes e saúde das instâncias.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-400 mr-2">Total MRR:</span>
                        <span className="font-mono font-bold text-slate-800">R$ 5.650,00</span>
                    </div>
                </div>
            </div>

            <TenantManagementTable tenants={MOCK_TENANTS} />
        </div>
    );
}
