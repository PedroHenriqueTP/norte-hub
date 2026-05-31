export default function BlogPost({ params }: { params: { slug: string } }) {
    return (
        <div className="min-h-screen bg-white text-black pt-32 pb-24 px-4">
            <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between bg-white/90 backdrop-blur-md">
                <a href="/blog" className="uppercase text-sm font-bold tracking-widest hover:text-gray-500">← Back to Insights</a>
            </header>

            <article className="container mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Insights</span>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-tight mb-8">
                        O Futuro do Branding na Era da IA
                    </h1>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                <div className="prose prose-lg prose-headings:font-heading prose-headings:uppercase prose-p:text-gray-600 mx-auto">
                    <p className="lead text-2xl font-light">
                        A inteligência artificial não é apenas uma ferramenta de automação. Ela é o novo pincel, a nova tipografia e, mais importante, o novo estrategista assistente.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h3>A Humanização da Máquina</h3>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <blockquote>
                        "A criatividade é a última fronteira humana. A IA é o foguete que nos leva até lá mais rápido."
                    </blockquote>
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                </div>
            </article>
        </div>
    );
}
