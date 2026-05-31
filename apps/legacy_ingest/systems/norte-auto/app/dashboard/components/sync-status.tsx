"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Cloud, CheckCircle } from "lucide-react";

export function SyncStatus() {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);

    // Mock polling logic
    useEffect(() => {
        const interval = setInterval(() => {
            // In real app, fetch /api/queue-status
            const randomState = Math.random();
            if (randomState > 0.7) {
                setStatus('syncing');
                setProgress((prev) => (prev + 10) % 100);
            } else if (randomState > 0.4) {
                setStatus('completed');
            } else {
                setStatus('idle');
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    if (status === 'idle') {
        return (
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Cloud className="h-4 w-4" />
                <span>Sincronizado</span>
            </div>
        );
    }

    if (status === 'completed') {
        return (
            <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Atualizado com sucesso</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-sm text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Sincronizando... {progress}%</span>
        </div>
    );
}
