import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Hero() {
    return (
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop"
                    alt="Natural Living Room"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-2xl text-white">
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
                        Coleção Outono 2024
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 shadow-sm">
                        Simplicidade <br />
                        <span className="italic font-light">que inspira.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg font-light leading-relaxed">
                        Descubra nossa seleção de produtos artesanais e sustentáveis para transformar sua casa em um refúgio de paz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/catalogo">
                            <Button size="lg" className="w-full sm:w-auto bg-stone-100 text-stone-900 override:text-stone-900 hover:bg-white">
                                Ver Coleção
                            </Button>
                        </Link>
                        <Link href="/catalogo?category=Casa">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                                Para sua Casa
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
