import { CopilotChat } from "@/components/copilot/copilot-chat";
import { TenantNavbar } from "@/components/layout/TenantNavbar";
import { getAuthContext } from "@/services/auth-context";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { role } = await getAuthContext();
    const isSuperAdmin = role === 'SUPER_ADMIN';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
            <TenantNavbar isSuperAdmin={isSuperAdmin} />

            <main className="flex-1 container mx-auto px-4 py-8 relative">
                {children}

                <div className="fixed bottom-6 right-6 z-50">
                    <CopilotChat />
                </div>
            </main>
        </div>
    )
}
