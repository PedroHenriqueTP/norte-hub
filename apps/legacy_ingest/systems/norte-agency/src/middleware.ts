
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    // @ts-ignore
    const isSuperAdmin = req.auth?.user?.role === "SUPER_ADMIN";
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isOnLogin = req.nextUrl.pathname.startsWith("/login");

    // 1. Protect Admin Routes
    if (isOnAdmin) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
        if (!isSuperAdmin) return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        return NextResponse.next();
    }

    // 2. Protect Dashboard Routes
    if (isOnDashboard) {
        if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));

        // Check for dev mode impersonation cookie
        const isImpersonating = req.cookies.get("agency-os-impersonating")?.value === "true";

        // Redirect Super Admin to Admin Panel (unless impersonating)
        if (isSuperAdmin && !isImpersonating) {
            return NextResponse.redirect(new URL("/admin", req.nextUrl));
        }

        return NextResponse.next();
    }

    // 3. Handle Login Redirects
    if (isOnLogin) {
        if (isLoggedIn) {
            if (isSuperAdmin) return NextResponse.redirect(new URL("/admin", req.nextUrl));
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
