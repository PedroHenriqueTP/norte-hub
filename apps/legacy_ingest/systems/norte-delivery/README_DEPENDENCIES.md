# Norte Global - Dependências e Infraestrutura

Este arquivo lista as dependências e a infraestrutura do ecossistema Norte Global após a simplificação para o MVP.

## Core Stack
- **Next.js (App Router)**: Framework do Hub (`apps/web`).
- **NestJS**: Backend robusto (`apps/api`).
- **Prisma ORM**: Ponte com o banco de dados.
- **PostgreSQL (Docker)**: Cluster unificado (`norte-db-cluster`).
- **Redis**: Cache e filas.

## Interface & Estética
- **Tailwind CSS**: Estilização via classes.
- **Framer Motion**: Animações (uso reduzido para focar em performance).
- **Lucide React**: Biblioteca de ícones.

## Notas de Simplificação (MVP)
- Removido `AtmosphereOverlay` e `LiveTelemetry` para reduzir consumo de CPU.
- Simplificado `BentoGrid` para 4 colunas padrão sem efeitos complexos de hover.
- Resolvido problema do `Puppeteer` instalando dependências com `--ignore-scripts`.
