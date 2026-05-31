"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // Don't show on root
    if (segments.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
            <Link
                href="/dashboard"
                className="flex items-center hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>

            {segments.map((segment, index) => {
                // If it's "dashboard", skip because we have the Home icon
                if (segment === "dashboard" && index === 0) return null;

                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const title = segment.charAt(0).toUpperCase() + segment.slice(1);

                return (
                    <Fragment key={href}>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                        {isLast ? (
                            <span className="font-medium text-slate-900 dark:text-slate-200">
                                {title}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors"
                            >
                                {title}
                            </Link>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}
