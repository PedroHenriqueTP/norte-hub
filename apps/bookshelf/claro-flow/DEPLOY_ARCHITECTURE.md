# Claro Conecta - Deployment Architecture & IaC

Este documento define a arquitetura de alta disponibilidade e os fluxos de deploy, atuando como o "Blueprint" do Líder de Infraestrutura. 

## 1. Topologia Edge-First (Next.js 16)
Devido à utilização do Next.js 16.2.6 (App Router), a arquitetura primária será alocada na **Vercel (Edge Network)**. Isso garante:
- **Zero Configuration Deploy:** Integração nativa de SSR e Server Components sem necessidade de instanciar containers manuais (ECS/Fargate).
- **Edge Caching Automático:** Páginas estáticas são cacheadas globalmente na CDN da Vercel.

## 2. PWA (Progressive Web App) e Offline Mode
- O projeto atua com um Service Worker (`sw.js`) que implementa a estratégia `stale-while-revalidate`.
- O App Shell e as fontes/estilos principais sobrevivem a zonas mortas de Wi-Fi.

## 3. Storage para Assets Pesados (AWS S3 + Cloudfront)
A Vercel hospedará a aplicação, porém vídeos 4K, imagens pesadas e arquivos estáticos cruciais que possam inflar o repositório devem ser movidos para:
- **Bucket:** AWS S3 (`claro-conecta-assets-prod`).
- **CDN Secundária:** AWS Cloudfront apontando para o S3 (ex: `cdn.conecta.claro.com.br`).

## 4. Agentes de CI/CD (Pipeline)
O deploy deve ser governado por **Github Actions** com o seguinte fluxo:
1. **Lint & Type Check:** Executa `npx tsc --noEmit`. Bloqueia o merge se falhar.
2. **Deploy-Guard Agent:** Uma step que faz `diff` de arquivos críticos de UI (`BRAND_STYLE.md`) e analisa regressões visuais.
3. **Produção (Vercel):** Se os testes passarem, o Vercel faz o *build* em produção.

## 5. Distribuição Física (QR Code Dinâmico)
- Não usaremos lojas de aplicativos (Google Play / App Store).
- A URL oficial (`conecta.claro.com.br`) será distribuída através de **QR Codes Dinâmicos** expostos nos tótens da Claro na Bienal e Interlagos.
- QR codes dinâmicos permitem alterar o destino ou incluir *UTMs* para rastrear de qual estande o usuário escaneou o código.
