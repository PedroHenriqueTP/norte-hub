import Link from 'next/link'
import { ArrowRight, Home, UserCheck, Laptop, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function ServicosPage() {
    const services = [
        {
            id: 1,
            icon: Home,
            title: 'Serviços de Casa',
            description: 'Soluções completas para sua residência. Manutenção, reparos, reformas e melhorias que transformam seu lar em um espaço mais confortável e funcional.',
            features: [
                'Manutenção preventiva e corretiva',
                'Reformas e melhorias residenciais',
                'Instalações elétricas e hidráulicas',
                'Pintura e acabamento profissional',
            ],
            imagePosition: 'left',
        },
        {
            id: 2,
            icon: UserCheck,
            title: 'Consultoria Pessoal',
            description: 'Orientação especializada para desenvolvimento pessoal e profissional. Ajudamos você a alcançar seus objetivos com estratégias personalizadas e acompanhamento dedicado.',
            features: [
                'Planejamento de carreira',
                'Desenvolvimento de habilidades',
                'Gestão financeira pessoal',
                'Coaching individualizado',
            ],
            imagePosition: 'right',
        },
        {
            id: 3,
            icon: Laptop,
            title: 'Sistemas para Seu Negócio',
            description: 'Tecnologia sob medida para impulsionar sua empresa. Desenvolvemos sistemas personalizados que otimizam processos e aumentam a produtividade do seu negócio.',
            features: [
                'Desenvolvimento de software customizado',
                'Automação de processos',
                'Integração de sistemas',
                'Suporte técnico especializado',
            ],
            imagePosition: 'left',
        },
        {
            id: 4,
            icon: TrendingUp,
            title: 'Mentoria para sua Empresa',
            description: 'Acelere o crescimento do seu negócio com mentoria estratégica. Experiência e conhecimento para guiar sua empresa rumo ao sucesso sustentável.',
            features: [
                'Estratégia de crescimento',
                'Gestão de equipes',
                'Otimização de processos',
                'Análise de mercado e concorrência',
            ],
            imagePosition: 'right',
        },
    ]

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold text-primary">
                            Nossos Serviços
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Soluções profissionais personalizadas para atender suas necessidades
                            com excelência e dedicação
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Sections */}
            {services.map((service, index) => {
                const Icon = service.icon
                const isLeft = service.imagePosition === 'left'

                return (
                    <section
                        key={service.id}
                        className={`py-20 md:py-24 ${index % 2 === 0 ? 'bg-background' : 'bg-gradient-to-br from-primary/5 to-accent/5'}`}
                    >
                        <div className="container mx-auto px-6">
                            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isLeft ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Image */}
                                <div className={`${!isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon className="h-32 w-32 text-primary/30" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={`space-y-6 ${!isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                                        <Icon className="h-4 w-4 text-accent" />
                                        <span className="text-sm font-semibold text-accent">Serviço {service.id}</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-bold text-primary">
                                        {service.title}
                                    </h2>

                                    <p className="text-lg text-text-secondary leading-relaxed">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-3">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <div className="w-2 h-2 bg-success rounded-full" />
                                                </div>
                                                <span className="text-text-secondary">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4">
                                        <Link
                                            href="/contato"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Solicitar Orçamento
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            })}

            {/* CTA Section */}
            <section className="py-24 bg-primary text-background">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
                    <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
                        Entre em contato e descubra como nossos serviços podem transformar
                        suas necessidades em resultados concretos
                    </p>
                    <Link
                        href="/contato"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-background text-primary font-semibold rounded-xl hover:bg-background/90 transition-all shadow-lg hover:shadow-xl"
                    >
                        Fale Conosco
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
