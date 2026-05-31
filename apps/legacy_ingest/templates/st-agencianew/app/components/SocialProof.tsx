"use client";

const clients = [
    "Lumina",
    "Vertex",
    "Apex Dynamics",
    "Nexa Corp",
    "Zenith",
    "Orbit",
];

export default function SocialProof() {
    return (
        <section className="bg-gray-100 py-16 text-black">
            <div className="container mx-auto px-4">
                {/* <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-widest text-gray-500">
          Trusted By
        </h2> */}
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {clients.map((client, index) => (
                        <div key={index} className="text-xl font-bold font-heading uppercase tracking-wider text-gray-400">
                            {/* Replaced with simple text logos for now, normally would be SVGs */}
                            {client}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
