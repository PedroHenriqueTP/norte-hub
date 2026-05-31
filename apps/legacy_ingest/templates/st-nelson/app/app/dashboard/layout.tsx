import { ReactNode } from "react"
import Link from "next/link"
import { Car, LayoutDashboard, Settings, LogOut, Package, Users, DollarSign, Store, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin, full_name')
        .eq('id', user.id)
        .single()

    const isSuperAdmin = profile?.is_super_admin

    // NOTE: In a real app we would fetch the Organization name here to display in the Sidebar.

    return (
        <div className="flex h-screen bg-gray-50 text-zinc-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-600 rounded-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold tracking-tight text-zinc-900">{isSuperAdmin ? 'AutoShop Admin' : 'AutoShop'}</span>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {isSuperAdmin ? (
                        <>
                            <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">SaaS Management</div>
                            <NavItem href="/app/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Visão Geral" active />
                            <NavItem href="/app/dashboard/tenants" icon={<Users className="w-5 h-5" />} label="Lojas (Tenants)" />
                            <NavItem href="/app/admin" icon={<LayoutDashboard className="w-5 h-5 text-red-600" />} label="Painel Super Admin" />
                            <NavItem href="/app/dashboard/financial-saas" icon={<DollarSign className="w-5 h-5" />} label="Financeiro SaaS" />
                            <NavItem href="/app/dashboard/settings-admin" icon={<Settings className="w-5 h-5" />} label="Configurações Admin" />
                        </>
                    ) : (
                        <>
                            <div className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sua Loja</div>
                            <NavItem href="/app/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Visão Geral" active />
                            <NavItem href="/app/dashboard/engine" icon={<Store className="w-5 h-5" />} label="Construtor de Site" />
                            <NavItem href="/app/dashboard/vehicles" icon={<Car className="w-5 h-5" />} label="Veículos" />
                            <NavItem href="/app/dashboard/financial" icon={<DollarSign className="w-5 h-5" />} label="Financeiro" />
                            <NavItem href="/app/dashboard/invoices" icon={<FileText className="w-5 h-5" />} label="Notas Fiscais" />
                            <NavItem href="/app/dashboard/employees" icon={<Users className="w-5 h-5" />} label="Equipe" />
                            <NavItem href="/app/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Configurações" />
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-200">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-zinc-700">{user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-zinc-900">{profile?.full_name || user.email}</p>
                            <p className="text-xs text-zinc-500">{isSuperAdmin ? 'Super Admin' : 'Lojista'}</p>
                        </div>
                        <LogOut className="w-4 h-4 text-zinc-500 hover:text-red-600 transition-colors" />
                    </div>
                </div>
            </aside >

            {/* Main Content */}
            < main className="flex-1 flex flex-col overflow-hidden relative" >
                {/* Mobile Header (Hidden on Desktop) */}
                < header className="h-16 md:hidden border-b border-zinc-200 flex items-center px-4 bg-white" >
                    <Car className="w-6 h-6 text-red-600 mr-2" />
                    <span className="font-bold text-zinc-900">AutoShop</span>
                </header >

                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    {/* Grid Background (Light Mode) */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="relative z-10 max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main >
        </div >
    )
}

function NavItem({ href, icon, label, active }: { href: string; icon: ReactNode; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
            ${active
                    ? "bg-red-50 text-red-600"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
        >
            <span className={`${active ? "text-red-600" : "text-zinc-500 group-hover:text-zinc-900"}`}>
                {icon}
            </span>
            {label}
        </Link>
    )
}
