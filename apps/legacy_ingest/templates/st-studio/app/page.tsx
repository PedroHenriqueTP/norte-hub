import Hero from '@/components/Hero'
import ServicesPreview from '@/components/ServicesPreview'
import PortfolioPreview from '@/components/PortfolioPreview'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div>
      <Hero />
      <ServicesPreview />
      <PortfolioPreview />
      <CTA />
    </div>
  )
}

