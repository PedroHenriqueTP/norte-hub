# Project Structure Map

## Root
- `apps/`
  - `web/`: Next.js Frontend Application
  - `api/`: NestJS Backend Application
- `packages/`
  - `database/`: Shared Prisma Schema and Client
  - `config/`: Shared configuration (ESLint, TSConfig) - *If Monorepo*
- `.agent/`: Skills and Artifacts for AI Agent

## 📂 Backend Structure (`apps/api/src`)
- `modules/`: Feature modules (Orders, Auth, Users, etc.)
  - `dto/`: Data Transfer Objects (Validation)
  - `entities/`: Response entities
  - `*.controller.ts`: Route handlers
  - `*.service.ts`: Business logic
  - `*.module.ts`: Dependency injection config
- `common/`: Shared utilities
  - `guards/`: Auth and Role guards
  - `decorators/`: Custom decorators (@CurrentUser, etc.)
  - `prisma/`: Database connection service

## 📂 Frontend Structure (`apps/web/src`)
- `app/`: Next.js App Router Pages
  - `(admin)/`: Protected Admin Routes
  - `(customer)/`: Public/Customer Routes
  - `api/`: Next.js API Routes (if used alongside NestJS)
- `components/`: React Components
  - `ui/`: ShadcnUI Atomic Components (Button, Input, etc.)
  - `admin/`: Admin-specific blocks
  - `store/`: Store-specific blocks
- `hooks/`: Custom React Hooks
- `lib/`: Utilities (axios, cn, formatters)
- `store/`: Zustand State Stores

## 🧩 Database
- `packages/database/prisma/schema.prisma`: Single Source of Truth for Data Models.
