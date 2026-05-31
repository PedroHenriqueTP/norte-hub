export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-zinc-950 text-center md:text-left">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-600 to-cyan-500 mr-2" />
                        <span className="text-lg font-bold text-white">AgencyOS</span>
                    </div>
                    <p className="text-zinc-500 text-sm">
                        O sistema operacional definitivo para agências criativas modernas.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Produto</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li className="hover:text-white cursor-pointer">Features</li>
                        <li className="hover:text-white cursor-pointer">Pricing</li>
                        <li className="hover:text-white cursor-pointer">Changelog</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Empresa</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li className="hover:text-white cursor-pointer">Sobre</li>
                        <li className="hover:text-white cursor-pointer">Carreiras</li>
                        <li className="hover:text-white cursor-pointer">Blog</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-zinc-400">
                        <li className="hover:text-white cursor-pointer">Privacidade</li>
                        <li className="hover:text-white cursor-pointer">Termos</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
                © 2024 AgencyOS Inc. All rights reserved.
            </div>
        </footer>
    );
}
