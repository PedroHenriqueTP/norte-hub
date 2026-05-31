import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname

            // Rotas admin requerem role ADMIN
            if (path.startsWith('/admin')) {
                return token?.role === 'ADMIN'
            }

            // Rotas de perfil requerem autenticação
            if (path.startsWith('/perfil')) {
                return !!token
            }

            return true
        },
    },
})

export const config = {
    matcher: ['/admin/:path*', '/perfil/:path*'],
}
