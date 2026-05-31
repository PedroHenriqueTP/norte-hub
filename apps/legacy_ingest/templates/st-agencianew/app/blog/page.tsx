import Link from "next/link";

const posts = [
    {
        slug: "futuro-do-branding",
        title: "O Futuro do Branding na Era da IA",
        category: "Insights",
        date: "20 Jan 2026",
        excerpt: "Como a inteligência artificial está redefinindo a construção de marcas e a conexão emocional com o consumidor."
    },
    {
        slug: "minimalismo-digital",
        title: "Minimalismo Digital: Menos é Mais Conversão",
        category: "Design",
        date: "15 Jan 2026",
        excerpt: "Por que interfaces limpas e objetivas superam designs complexos em performance e retenção de usuários."
    }
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-white text-black p-4 md:p-12 pt-32">
            <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between bg-white/90 backdrop-blur-md">
                <a href="/" className="text-xl font-bold font-heading">ANTIGRAVITY</a>
                <nav className="hidden md:block">
                    <ul className="flex gap-6 uppercase text-sm font-bold tracking-widest">
                        <li><a href="/briefing">Contato</a></li>
                    </ul>
                </nav>
            </header>

            <div className="container mx-auto max-w-4xl">
                <h1 className="text-6xl md:text-9xl font-bold font-heading uppercase mb-24 tracking-tighter">Insights</h1>

                <div className="space-y-24">
                    {posts.map((post) => (
                        <article key={post.slug} className="group cursor-pointer">
                            <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span>{post.category}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>{post.date}</span>
                            </div>
                            <Link href={`/blog/${post.slug}`}>
                                <h2 className="text-4xl md:text-6xl font-bold font-heading uppercase leading-tight mb-6 group-hover:underline decoration-2 underline-offset-8">
                                    {post.title}
                                </h2>
                            </Link>
                            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                {post.excerpt}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
