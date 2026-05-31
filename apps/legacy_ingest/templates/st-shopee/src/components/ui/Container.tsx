import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Container({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
            {...props}
        >
            {children}
        </div>
    );
}
