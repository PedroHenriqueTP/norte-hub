import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const navigation = {
        pages: [
            { name: 'Home', href: '/' },
            { name: 'Portfólio', href: '/portfolio' },
            { name: 'Serviços', href: '/servicos' },
            { name: 'Avaliações', href: '/avaliacoes' },
            { name: 'Contato', href: '/contato' },
        ],
        account: [
            { name: 'Entrar', href: '/login' },
            { name: 'Cadastrar', href: '/cadastro' },
            { name: 'Meu Perfil', href: '/perfil' },
        ],
        social: [
            { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
            { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
            { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
        ],
    }

    return (
        <footer className="bg-primary text-background border-t border-primary-dark">
            <div className="container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-tight">Profissional</h3>
                        <p className="text-sm text-background/80 leading-relaxed">
                            Serviços profissionais de qualidade com responsabilidade e excelência.
                            Transformando suas necessidades em soluções concretas.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Navegação</h4>
                        <ul className="space-y-3">
                            {navigation.pages.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-background/80 hover:text-background transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Conta</h4>
                        <ul className="space-y-3">
                            {navigation.account.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-background/80 hover:text-background transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Contato</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-background/80">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>(11) 99999-9999</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-background/80">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span>contato@profissional.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-background/80">
                                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>São Paulo, SP</span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex gap-4 pt-4">
                            {navigation.social.map((item) => {
                                const Icon = item.icon
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors"
                                        aria-label={item.name}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-background/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-background/60">
                            © {currentYear} Profissional. Todos os direitos reservados.
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="text-sm text-background/60 hover:text-background transition-colors">
                                Privacidade
                            </Link>
                            <Link href="#" className="text-sm text-background/60 hover:text-background transition-colors">
                                Termos de Uso
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
