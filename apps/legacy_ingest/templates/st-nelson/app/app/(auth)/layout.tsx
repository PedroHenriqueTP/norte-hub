import { ReactNode } from "react"
import { Car } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-5 blur-[100px]"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-8">
                <div className="flex items-center gap-2 animate-fade-in">
                    <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-600/20">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-zinc-900">AutoShop</span>
                </div>

                {children}

                <p className="text-zinc-500 text-sm text-center">
                    Powered by AutoShop SaaS Protocol &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}
