"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function WelcomeHeader() {
    const { data: session } = useSession();
    const [date, setDate] = useState<string>("");
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        // Set Date
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDate(now.toLocaleDateString('pt-BR', options));

        // Set Greeting
        const hour = now.getHours();
        if (hour < 12) setGreeting("Bom dia");
        else if (hour < 18) setGreeting("Boa tarde");
        else setGreeting("Boa noite");
    }, []);

    const firstName = session?.user?.name?.split(" ")[0] || "Visitante";

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
                {greeting}, <span className="text-violet-600">{firstName}</span>.
            </h1>
            <p className="text-slate-500 capitalize mt-1">
                {date}
            </p>
        </div>
    );
}
