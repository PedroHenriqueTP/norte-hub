import { AdminHeader } from "@/components/admin/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="pt-32 px-8 pb-12 max-w-[1920px] mx-auto">
                {children}
            </main>
        </div>
    );
}
