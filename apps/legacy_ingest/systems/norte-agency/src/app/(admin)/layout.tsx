import { GodModeSwitcher } from "@/components/admin/god-mode-switcher";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { RebrandingService } from "@/services/rebranding.service";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const config = await RebrandingService.getConfig();

    return (
        <div 
            className="flex min-h-screen"
            style={{ 
                fontFamily: config.fontFamily,
                backgroundColor: "#020617" // Slate 950 base for the new aesthetic
            }}
        >
            {/* Inject dynamic CSS variables for the Rebranding */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    :root {
                        --norte-primary: ${config.primaryColor};
                    }
                    * {
                        font-family: '${config.fontFamily}', sans-serif;
                    }
                `
            }} />

            <AdminSidebar brandName={config.brandName} primaryColor={config.primaryColor} />
            <div className="flex-1 flex flex-col">
                <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
                    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white border-l border-slate-700 pl-4 ml-2" style={{ color: "var(--norte-primary)" }}>
                                {config.brandName} Workspace
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <GodModeSwitcher />
                            <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border"
                                style={{
                                    backgroundColor: `${config.primaryColor}20`, // 20% opacity
                                    color: config.primaryColor,
                                    borderColor: `${config.primaryColor}50`
                                }}
                            >
                                {config.brandName.substring(0,2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto px-6 py-8 flex-1 bg-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
