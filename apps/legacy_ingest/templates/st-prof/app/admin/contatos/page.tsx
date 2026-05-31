import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export default async function AdminContactsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login')
    }

    const contacts = await prisma.contactForm.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="min-h-screen bg-border-light">
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Formulários de Contato</h1>
                    <p className="text-text-secondary">{contacts.length} contatos recebidos</p>
                </div>

                {contacts.length === 0 ? (
                    <div className="bg-background border border-border rounded-lg p-12 text-center">
                        <p className="text-text-secondary">Nenhum contato recebido ainda</p>
                    </div>
                ) : (
                    <div className="bg-background border border-border rounded-lg divide-y divide-border-light">
                        {contacts.map((contact) => (
                            <div key={contact.id} className="p-6 hover:bg-border-light transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-primary text-lg">{contact.name}</h3>
                                        <div className="text-sm text-text-secondary mt-1">
                                            {contact.email} • {contact.phone}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${contact.status === 'new'
                                            ? 'bg-accent/10 text-accent'
                                            : contact.status === 'contacted'
                                                ? 'bg-warning/10 text-warning'
                                                : 'bg-success/10 text-success'
                                        }`}>
                                        {contact.status === 'new' ? 'Novo' : contact.status === 'contacted' ? 'Contatado' : 'Convertido'}
                                    </span>
                                </div>
                                <p className="text-text-primary mb-3">{contact.message}</p>
                                <div className="text-xs text-text-muted">
                                    {new Date(contact.createdAt).toLocaleString('pt-BR')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
