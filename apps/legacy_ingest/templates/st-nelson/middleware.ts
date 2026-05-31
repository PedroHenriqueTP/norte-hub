import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    ],
}

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl

    // Get hostname (e.g. "foo.autoshop.com" or "localhost:3000")
    let hostname = req.headers.get("host")!.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

    // Handle Vercel preview URLs or local development
    if (hostname.includes("vercel.app")) {
        hostname = `${hostname.split(".")[0]}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    }

    // Define the root domain (e.g. "autoshop.com")
    // For local dev, we effectively treat "localhost:3000" as the root if configured, 
    // but simpler to check against specific app subdomains.
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

    const searchParams = req.nextUrl.searchParams.toString()
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`

    // 1. App Subdomain (app.autoshop.com) -> /app
    if (hostname === `app.${rootDomain}`) {
        // Session check for App
        await updateSession(req)
        return NextResponse.rewrite(new URL(`/app${path === "/" ? "/dashboard" : path}`, req.url))
    }

    // 2. Admin Subdomain (admin.autoshop.com) -> /admin
    if (hostname === `admin.${rootDomain}`) {
        await updateSession(req)
        return NextResponse.rewrite(new URL(`/admin${path}`, req.url))
    }

    // 3. Root Domain (autoshop.com) -> /home (or currently /(marketing))
    if (hostname === rootDomain) {
        return NextResponse.next()
        // Wait, our folder is (marketing) which resolves to root / path. 
        // If we rewrite to /home, we need a folder named home?
        // Actually, if we just let it pass through, it hits app/page.tsx (now in (marketing)). 
        // But since we moved app/page.tsx to app/(marketing)/page.tsx, Next.js handles it as root '/' automatically?
        // NO. Route Groups don't change the URL path, but they organize file structure.
        // So 'app/(marketing)/page.tsx' is served at '/'.
        // BUT we are rewriting everything else.
        // If we don't rewrite, it serves the file at matches.
        // Let's rewrite to ensure explicit handling if needed, but for root usually null rewrite is fine.
        // HOWEVER, if we have /app and /site folders, we don't want root to accidentally hit them?
        // Route groups: (marketing) is root. (app) is not URL prefixed unless we make it.
        // If we move (auth) and dashboard into app/app/, then they are at /app/(auth) and /app/dashboard physically?
        // Yes.
        // So `app.autoshop.com/dashboard` -> rewrite to `/app/dashboard`. Correct.

        // For Root:
        // If we just return next(), it renders what's at /.
        // What is at /? app/(marketing)/page.tsx -> /.
        // app/app/dashboard/page.tsx -> /app/dashboard.
        // So logic holds.
        return NextResponse.next()
    }

    // 4. Tenant Subdomain (foo.autoshop.com) -> /site/[slug]
    // Extract subdomain "foo"
    const subdomain = hostname.replace(`.${rootDomain}`, "")

    // Rewrite to the dynamic route
    return NextResponse.rewrite(new URL(`/site/${subdomain}${path}`, req.url))
}
