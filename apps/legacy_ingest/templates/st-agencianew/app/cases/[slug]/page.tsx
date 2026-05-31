import { notFound } from "next/navigation";

// Placeholder data - in a real app this would come from a CMS or Database
const cases = {
    "aurora-tech": {
        client: "Aurora Tech",
        title: "Rebranding the Future of AI",
        service: "Branding & Identidade",
        challenge: "Humanizar uma marca de inteligência artificial fria e distante, criando conexão emocional com o público B2B.",
        solution: "Desenvolvemos uma identidade visual fluida, organicamente digital, que representa a simbiose entre humano e máquina. A paleta de cores evoluiu para tons quentes de neon.",
        results: [
            { label: "Aumento de Leads", value: "+140%" },
            { label: "Taxa de Conversão", value: "3.5x" },
            { label: "Brand Awareness", value: "+85%" }
        ],
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ", // Placeholder
        images: ["https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800", "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"]
    },
    "vela-co": {
        client: "Vela Co.",
        title: "Sailing Through Digital Storms",
        service: "Social Media",
        challenge: "Posicionar uma marca tradicional de moda praia no mercado digital saturado.",
        solution: "Uma estratégia de conteúdo focada em lifestyle e storytelling, não apenas produto.",
        results: [
            { label: "Seguidores", value: "+50k" },
            { label: "Engajamento", value: "12%" }
        ],
        video: "",
        images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800"]
    }
};

export async function generateStaticParams() {
    return Object.keys(cases).map((slug) => ({
        slug: slug,
    }));
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
    const project = cases[params.slug as keyof typeof cases];

    if (!project) {
        // In a real scenario, handle partial matches or 404
        // For this static export demo, we return 404
        // But since we are in a simple map, if not found, we can try to return a default or 404
        // return notFound(); 
        // Just using the first one as fallback for demo if needed, but notFound is better
    }

    if (!project) return <div className="p-20 text-center">Case not found. <a href="/" className="underline">Go Home</a></div>;

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between mix-blend-difference text-white">
                <a href="/" className="text-xl font-bold font-heading">ANTIGRAVITY</a>
                <a href="/briefing" className="uppercase text-sm tracking-widest border border-white rounded-full px-4 py-2 hover:bg-white hover:text-black transition">Start Project</a>
            </header>

            {/* Hero */}
            <section className="pt-40 pb-20 px-4 container mx-auto">
                <h1 className="text-6xl md:text-8xl font-bold font-heading uppercase leading-none mb-8">{project.client}</h1>
                <p className="text-xl text-gray-500 max-w-2xl mb-12">{project.service} — {project.title}</p>

                {/* Video or Main Image */}
                <div className="w-full h-[60vh] md:h-[80vh] bg-gray-200 overflow-hidden mb-20 relative">
                    {project.video ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={project.video}
                            title="Video player"
                            frameBorder="0"
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <img src={project.images[0]} className="w-full h-full object-cover" alt="Cover" />
                    )}
                </div>

                {/* Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">O Desafio</h3>
                        <p className="text-2xl font-light leading-relaxed">{project.challenge}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">A Solução</h3>
                        <p className="text-lg text-gray-600 leading-relaxed">{project.solution}</p>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 gap-8 mb-24">
                    {project.images.map((img, i) => (
                        <img key={i} src={img} alt="Detail" className="w-full h-auto" />
                    ))}
                </div>

                {/* Results */}
                <div className="bg-black text-white p-12 md:p-24 mb-24">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-12 text-gray-400">Resultados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {project.results.map((res, i) => (
                            <div key={i} className="border-t border-gray-800 pt-6">
                                <div className="text-5xl md:text-7xl font-bold font-heading mb-2">{res.value}</div>
                                <div className="text-gray-400 uppercase tracking-widest text-sm">{res.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Project / CTA */}
                <div className="text-center py-24 border-t border-gray-200">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Próximo Case</h4>
                    <a href="/" className="text-4xl md:text-6xl font-bold font-heading uppercase hover:underline">Design Revolutions</a>
                </div>
            </section>
        </div>
    );
}
