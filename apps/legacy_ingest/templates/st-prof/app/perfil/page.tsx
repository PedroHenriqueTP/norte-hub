import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Buscar dados completos do usuário
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true,
        },
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-12">
            <div className="container max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Meu Perfil</h1>
                    <p className="text-text-secondary">
                        Gerencie suas informações pessoais
                    </p>
                </div>

                <div className="bg-background border border-border rounded-lg p-8">
                    {/* User Info */}
                    <div className="mb-8 pb-8 border-b border-border-light">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent text-2xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-primary">{user.name}</h2>
                                <p className="text-text-secondary">{user.email}</p>
                                <p className="text-sm text-text-muted mt-1">
                                    Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <ProfileForm user={user} />
                </div>
            </div>
        </div>
    )
}
