import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export default async function AdminClientsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const clients = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
        },
    })

    return (
        <div className="min-h-screen bg-border-light">
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Clientes Cadastrados</h1>
                    <p className="text-text-secondary">{clients.length} clientes no total</p>
                </div>

                {clients.length === 0 ? (
                    <div className="bg-background border border-border rounded-lg p-12 text-center">
                        <p className="text-text-secondary">Nenhum cliente cadastrado ainda</p>
                    </div>
                ) : (
                    <div className="bg-background border border-border rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-border-light">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Telefone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                                        Cadastro
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light">
                                {clients.map((client) => (
                                    <tr key={client.id} className="hover:bg-border-light transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-primary">{client.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                                            {client.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                                            {client.phone || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary text-sm">
                                            {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
