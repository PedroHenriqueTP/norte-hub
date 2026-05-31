import './globals.css'
import type { Metadata } from 'next'
import OmniSearch from '@/components/navigation/OmniSearch'

export const metadata: Metadata = {
  title: 'Norte Hub - Neural Gateway',
  description: 'Sincronia e Performance Bruta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        {children}
        <OmniSearch />
        <footer style={{ position: 'fixed', bottom: '10px', right: '20px', fontSize: '8px', color: 'rgba(0,242,255,0.1)', pointerEvents: 'none' }}>
          AGENT_CORE_ACTIVE // FREQ: 08052026_0245 // STATUS: OPTIMIZED
        </footer>
      </body>
    </html>
  )
}