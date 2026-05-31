'use client'

import Link from 'next/link'
import { ArrowRight, Users, Briefcase, MapPin, Mail, Phone, CheckCircle2, Home, UserCheck, Laptop, TrendingUp } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      id: 1,
      icon: Home,
      title: 'Serviços de Casa',
      description: 'Soluções completas para sua residência com manutenção, reparos e reformas profissionais.',
      features: ['Manutenção preventiva', 'Reformas completas', 'Instalações especializadas'],
      imagePosition: 'left',
    },
    {
      id: 2,
      icon: UserCheck,
      title: 'Consultoria Pessoal',
      description: 'Orientação especializada para desenvolvimento pessoal e profissional com estratégias personalizadas.',
      features: ['Planejamento de carreira', 'Desenvolvimento pessoal', 'Coaching individualizado'],
      imagePosition: 'right',
    },
    {
      id: 3,
      icon: Laptop,
      title: 'Sistemas para Negócios',
      description: 'Tecnologia sob medida que otimiza processos e aumenta a produtividade do seu negócio.',
      features: ['Software customizado', 'Automação de processos', 'Suporte especializado'],
      imagePosition: 'left',
    },
    {
      id: 4,
      icon: TrendingUp,
      title: 'Mentoria Empresarial',
      description: 'Acelere o crescimento com mentoria estratégica e experiência comprovada no mercado.',
      features: ['Estratégia de crescimento', 'Gestão de equipes', 'Análise de mercado'],
      imagePosition: 'right',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full Width */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <div className="inline-block px-6 py-3 bg-background/10 backdrop-blur-sm rounded-full border border-background/20">
                <span className="text-background font-semibold">Serviços Profissionais de Excelência</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-background leading-tight">
              Transformando Ideias em{' '}
              <span className="text-accent">Resultados</span>
            </h1>

            <p className="text-xl md:text-2xl text-background/90 leading-relaxed max-w-3xl mx-auto">
              Experiência, responsabilidade e excelência em cada projeto.
              Soluções profissionais que fazem a diferença.
            </p>

            <div className="pt-8 flex justify-center">
              <Link
                href="/contato"
                className="inline-flex items-center gap-3 px-12 py-6 bg-background text-primary font-bold text-xl rounded-xl hover:bg-background/90 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                Fale Conosco
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-background mb-2">100+</div>
                <div className="text-background/80">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-background mb-2">50+</div>
                <div className="text-background/80">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-background mb-2">5★</div>
                <div className="text-background/80">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="relative py-16 bg-background">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Quem Somos Section */}
      <section
        ref={(el) => { sectionsRef.current[0] = el }}
        className="py-24 md:py-32 bg-background opacity-0 transition-all duration-1000"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Sobre Nós</span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Quem Somos
                </h2>

                <p className="text-lg text-text-secondary leading-relaxed">
                  Somos uma equipe de profissionais dedicados a oferecer serviços de excelência.
                  Com anos de experiência no mercado, transformamos desafios em oportunidades
                  e ideias em resultados concretos.
                </p>

                <ul className="space-y-4">
                  {['Compromisso com a qualidade', 'Atendimento personalizado', 'Resultados comprovados'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <span className="text-text-primary font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 flex justify-center lg:justify-start">
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-background font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                  >
                    Fale Conosco
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                </div>
              </div>

              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto lg:mx-0 w-full max-w-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-40 w-40 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider with Pattern */}
      <div className="relative py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center rotate-45 shadow-lg">
              <Briefcase className="h-10 w-10 text-primary -rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Nossos Serviços Section */}
      <section
        ref={(el) => { sectionsRef.current[1] = el }}
        className="py-24 md:py-32 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-all duration-1000"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <Briefcase className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-accent">O Que Fazemos</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Nossos Serviços
            </h2>

            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Oferecemos soluções completas e personalizadas para atender suas necessidades
            </p>
          </div>

          {/* Services with alternating layout */}
          <div className="max-w-6xl mx-auto space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon
              const isLeft = service.imagePosition === 'left'

              return (
                <div key={service.id}>
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
                    <div className={`space-y-6 text-center lg:text-left ${!isLeft ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="flex justify-center lg:justify-start">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                          <Icon className="h-4 w-4 text-accent" />
                          <span className="text-sm font-semibold text-accent">Serviço {service.id}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-primary">
                        {service.title}
                      </h3>

                      <p className="text-lg text-text-secondary leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 justify-center lg:justify-start">
                            <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-success rounded-full" />
                            </div>
                            <span className="text-text-secondary">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mini divider between services */}
                  {index < services.length - 1 && (
                    <div className="flex justify-center mt-16">
                      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-full" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mt-20">
            <Link
              href="/servicos"
              className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-background font-bold text-xl rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Ver Todos os Serviços
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative Divider with Dots */}
      <div className="relative py-16 bg-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-primary/30 rounded-full" />
            <div className="w-2 h-2 bg-accent/30 rounded-full" />
            <div className="w-2 h-2 bg-primary/30 rounded-full" />
          </div>
        </div>
        <div className="relative flex justify-center pt-8">
          <div className="bg-background px-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Onde Estamos Section */}
      <section
        ref={(el) => { sectionsRef.current[2] = el }}
        className="py-24 md:py-32 bg-background opacity-0 transition-all duration-1000"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20 lg:order-1 mx-auto lg:mx-0 w-full max-w-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-40 w-40 text-primary/30" />
                </div>
              </div>

              <div className="space-y-6 lg:order-2 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Localização</span>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Onde Estamos
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-primary mb-1">Endereço</h4>
                      <p className="text-text-secondary">São Paulo, SP - Brasil</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-primary mb-1">Telefone</h4>
                      <p className="text-text-secondary">(11) 99999-9999</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 justify-center lg:justify-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-primary mb-1">Email</h4>
                      <p className="text-text-secondary">contato@profissional.com</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                  <Link
                    href="/contato"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-background font-bold text-lg rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
                  >
                    Entre em Contato
                    <ArrowRight className="h-6 w-6" />
                  </Link>

                  <a
                    href={`https://wa.me/5511999999999`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-primary text-primary font-bold text-lg rounded-xl hover:bg-primary hover:text-background transition-all"
                  >
                    WhatsApp
                    <Phone className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
