# Tech Stack & Guidelines

## 🏗️ Core Stack
- **Frontend:** Next.js 14+ (App Router)
- **Backend:** NestJS (Modular Architecture)
- **Database:** PostgreSQL (via Prisma ORM)
- **Infra:** Docker & Docker Compose
- **State Management:** Zustand (Frontend) / Services (Backend)
- **Styling:** Tailwind CSS + ShadcnUI (Lucide Icons)

## 🎨 Frontend Guidelines (Next.js)
- **Server Components:** Default. Use `'use client'` only for interactive components (hooks, events).
- **Styling:** Use Tailwind utility classes. Avoid CSS Modules unless necessary for complex animations.
- **Fetching:** Use Server Actions or API routes via `fetch` in Server Components. Use `useQuery` (TanStack) or custom hooks in Client Components.
- **Forms:** validated with Zod + React Hook Form.

## ⚙️ Backend Guidelines (NestJS)
- **Architecture:** Modules -> Controllers -> Services -> Prisma Repository.
- **Validation:** DTOs with `class-validator`.
- **Docs:** Swagger/OpenAPI decorated on Controllers.
- **Security:** Guards for Auth, Interceptors for Logging/Response format.
- **Prisma:** Always use `prisma.extended` (if configured) for Tenant isolation.

## 🐳 DevOps & Workflow
- **Linting:** ESLint + Prettier. Run before commit.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`).
- **Env:** Never commit `.env` files. Use `.env.example`.

## 🚫 Forbidden
- Do not use styled-components (Use Tailwind).
- Do not use raw SQL queries unless for complex aggregations (Use Prisma).
- Do not put business logic in Controllers (Use Services).
