import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
});

export const config = {
    matcher: ["/dashboard/:path*", "/finance/:path*", "/orders/:path*", "/tables/:path*", "/menu/:path*", "/team/:path*", "/customers/:path*", "/waiting-list/:path*", "/integrations/:path*", "/settings/:path*"]
};
