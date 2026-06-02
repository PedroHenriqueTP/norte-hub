import './globals.css';
import { Providers } from '../components/Providers';

export const metadata = {
  title: 'Delivery Platform - Painel Operacional',
  description: 'Uma visão minimalista para operacionalizar restaurantes com múltiplos canais.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="app-shell">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

