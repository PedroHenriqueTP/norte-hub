"use client";

export default function Footer() {
    return (
        <footer className="bg-black py-24 text-white">
            <div className="container mx-auto px-4">
                <div className="mb-16">
                    <h2 className="mb-8 text-5xl font-bold uppercase leading-tight font-heading md:text-7xl lg:text-8xl">
                        Vamos criar <br /> algo juntos?
                    </h2>
                    <a href="/briefing" className="inline-block rounded-full border border-white bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-white hover:text-black">
                        Começar Projeto
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-4 border-t border-gray-800 pt-12">
                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">Menu</h4>
                        <ul className="space-y-2 text-lg">
                            <li><a href="/" className="hover:text-gray-300">Home</a></li>
                            <li><a href="/cases" className="hover:text-gray-300">Cases</a></li>
                            <li><a href="/blog" className="hover:text-gray-300">Insights</a></li>
                            <li><a href="/briefing" className="hover:text-gray-300">Contato</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">Social</h4>
                        <ul className="space-y-2 text-lg">
                            <li><a href="#" className="hover:text-gray-300">Instagram</a></li>
                            <li><a href="#" className="hover:text-gray-300">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-gray-300">Behance</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">Contato</h4>
                        <p className="text-lg">hello@antigravity.agency</p>
                        <p className="text-lg">+55 11 99999-9999</p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-bold uppercase text-gray-500">Endereço</h4>
                        <p className="text-lg text-gray-400">
                            Av. Paulista, 1000 <br />
                            São Paulo, SP
                        </p>
                    </div>
                </div>

                <div className="mt-24 text-center text-xs text-gray-600 uppercase">
                    &copy; {new Date().getFullYear()} Antigravity Agency. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
