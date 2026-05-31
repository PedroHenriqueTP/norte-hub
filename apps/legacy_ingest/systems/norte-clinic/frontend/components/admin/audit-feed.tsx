"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, UserCog, AlertTriangle, FileText } from "lucide-react";

const MOCK_LOGS = [
    { id: 1, action: "UPDATE_PLAN", details: "Alterou plano de tenant_001 para Enterprise", user: "admin@medcura.com", time: "14:32", type: "warning" },
    { id: 2, action: "VIEW_REPORT", details: "Visualizou relatório financeiro global", user: "financeiro@medcura.com", time: "14:15", type: "info" },
    { id: 3, action: "LOGIN_FAILED", details: "Tentativa de acesso bloqueada (IP suspeito)", user: "desconhecido", time: "13:55", type: "danger" },
    { id: 4, action: "CREATE_TENANT", details: "Nova clínica cadastrada: Dr. João", user: "sales@medcura.com", time: "11:20", type: "success" },
    { id: 5, action: "SYS_BACKUP", details: "Backup automático de banco de dados", user: "system", time: "04:00", type: "system" },
];

const getIcon = (type: string) => {
    switch (type) {
        case "warning": return <UserCog className="w-4 h-4 text-amber-500" />;
        case "danger": return <AlertTriangle className="w-4 h-4 text-rose-500" />;
        case "system": return <ServerIcon className="w-4 h-4 text-slate-400" />;
        default: return <Shield className="w-4 h-4 text-blue-500" />;
    }
};

function ServerIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
            <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
            <line x1="6" x2="6.01" y1="6" y2="6" />
            <line x1="6" x2="6.01" y1="18" y2="18" />
        </svg>
    )
}

export function AuditFeed() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feed de Auditoria</h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Ao Vivo</span>
            </div>
            <ScrollArea className="flex-1 p-4 h-[400px]">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {MOCK_LOGS.map((log) => (
                        <div key={log.id} className="relative flex items-start group">
                            <div className="absolute left-0 top-1 ml-2.5 -mt-0.5 -translate-x-1/2 rounded-full bg-slate-100 border border-slate-200 p-1 group-hover:scale-110 transition-transform bg-white z-10">
                                {getIcon(log.type)}
                            </div>
                            <div className="ml-10 w-full">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="text-xs font-bold text-slate-700">{log.action}</h4>
                                    <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {log.details}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                    User: <span className="text-slate-600">{log.user}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
