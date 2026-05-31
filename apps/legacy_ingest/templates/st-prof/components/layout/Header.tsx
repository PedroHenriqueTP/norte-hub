'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
    const { data: session } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/portfolio', label: 'Portfólio' },
        { href: '/servicos', label: 'Serviços' },
        { href: '/avaliacoes', label: 'Avaliações' },
        { href: '/contato', label: 'Contato' },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex h-24 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-3xl font-bold text-primary tracking-tight hover:text-accent transition-colors">
                        Profissional
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-base font-medium text-text-secondary hover:text-primary transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-3 px-5 py-3 text-base font-medium text-text-primary hover:text-accent transition-colors rounded-xl hover:bg-border-light"
                                >
                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-lg">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{session.user.name}</span>
                                </button>

                                {profileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-2xl py-2">
                                        <Link
                                            href="/perfil"
                                            className="flex items-center gap-3 px-5 py-3 text-base text-text-primary hover:bg-border-light transition-colors"
                                            onClick={() => setProfileMenuOpen(false)}
                                        >
                                            <User className="h-5 w-5" />
                                            Meu Perfil
                                        </Link>
                                        {session.user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-5 py-3 text-base text-text-primary hover:bg-border-light transition-colors"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <LayoutDashboard className="h-5 w-5" />
                                                Painel Admin
                                            </Link>
                                        )}
                                        <div className="border-t border-border my-2"></div>
                                        <button
                                            onClick={() => {
                                                setProfileMenuOpen(false)
                                                signOut()
                                            }}
                                            className="w-full flex items-center gap-3 px-5 py-3 text-base text-error hover:bg-error/10 transition-colors"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-base font-medium text-text-secondary hover:text-primary transition-colors px-5 py-3"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/cadastro"
                                    className="px-7 py-3 text-base font-semibold text-background bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-md hover:shadow-lg"
                                >
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-3 text-text-primary hover:bg-border-light rounded-xl transition-colors"
                    >
                        {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-6 border-t border-border-light">
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-base font-medium text-text-secondary hover:text-primary transition-colors py-3"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-border-light flex flex-col gap-3">
                                {session ? (
                                    <>
                                        <Link
                                            href="/perfil"
                                            className="text-base font-medium text-text-primary py-3"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Meu Perfil
                                        </Link>
                                        {session.user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin"
                                                className="text-base font-medium text-text-primary py-3"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Painel Admin
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false)
                                                signOut()
                                            }}
                                            className="text-left text-base font-medium text-error py-3"
                                        >
                                            Sair
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-base font-medium text-text-secondary py-3"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Entrar
                                        </Link>
                                        <Link
                                            href="/cadastro"
                                            className="px-6 py-3 text-sm font-semibold text-background bg-primary hover:bg-primary-dark rounded-lg transition-colors text-center"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Cadastrar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
