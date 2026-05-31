"use client";

interface RoleDebugProps {
    role: string;
    canEdit: boolean;
}

export function RoleDebug({ role, canEdit }: RoleDebugProps) {
    if (process.env.NODE_ENV === "production") return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
            Role: {role} | Can Edit: {canEdit ? "Yes" : "No"}
        </div>
    );
}
