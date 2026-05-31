# Arquitetura do Projeto (Monorepo)

Este projeto utiliza uma arquitetura Monorepo baseada em Turborepo (conceitual) ou Workspaces do NPM, organizando múltiplos aplicativos e pacotes compartilhados em um único repositório.

## 📂 Estrutura de Pastas

### `apps/`
Onde residem as aplicações executáveis.

-   **`api` (NestJS)**:
    -   Backend central da plataforma.
    -   Arquitetura modular (`modules/`).
    -   Responsável pela lógica de negócios, conexão com banco de dados e integrações.
-   **`web` (Next.js)**:
    -   Frontend da plataforma (Admin Panel, Loja, App do Garçom).
    -   Renderização híbrida (SSR/CSR).
    -   Consome a API via REST.

### `packages/`
Bibliotecas e configurações compartilhadas.

-   **`database`**:
    -   Contém o esquema do Prisma (`schema.prisma`).
    -   Gera o cliente do banco de dados utilizado pela API.
-   **`config`** (Opcional):
    -   Configurações compartilhadas de ESLint, TSConfig, etc.

## 🔄 Fluxo de Dados

1.  **Cliente/Admin** interage com o Frontend (`apps/web`).
2.  Frontend faz requisições HTTP para a API (`apps/api`).
3.  API valida a requisição (Guards, DTOs).
4.  Controller chama o Service correspondente.
5.  Service executa a regra de negócio e acessa o Banco de Dados via Prisma Client (`packages/database`).
6.  Dados são retornados e formatados para o Frontend.

## 🛠️ Tecnologias Chave

-   **Linguagem**: TypeScript (Fullstack).
-   **Backend**: NestJS, Prisma ORM, PostgreSQL.
-   **Frontend**: Next.js, React, Tailwind CSS.
-   **DevOps**: Docker, Docker Compose.

## 🤖 Automação e IA

O projeto utiliza Skills de IA (como `DocReviewer`) para manter a documentação sincronizada com o código. Scripts localizados em `.agent/skills/` ajudam na manutenção e revisão automática.
