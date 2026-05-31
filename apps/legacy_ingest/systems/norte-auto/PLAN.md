# PLAN.md - OmniSync Retail Hub (Multi-tenant SaaS)

## 1. Project Setup & Authentication
- [ ] Initialize Next.js 15 App (App Router, TypeScript)
- [ ] Install `next-auth@beta`, `bcryptjs`, `@prisma/client`, `prisma`
- [ ] Configure `auth.ts` (NextAuth v5) with Credentials and Google providers
- [ ] Create `middleware.ts` to protect `/dashboard` routes

## 2. Database Schema (Multi-tenant)
- [ ] Define `User` model: id, name, email, password, plan
- [ ] Define `IntegrationConfig`: id, userId, platform (ML, Shopee), encryptedCurrentials
- [ ] Define `Product`: id, userId, sku, name, stock, etc.
- [ ] Define `Order`: id, userId, status, etc.
- [ ] **Constraint**: All core models must have `userId` relation.

## 3. Security Implementation
- [ ] Create `lib/crypto.ts` for encrypting/decrypting marketplace keys
- [ ] Implement Data Access Layer (DAL) ensuring `where: { userId: session.user.id }` in all queries
- [ ] Verify `userId` presence in all mutations (create/update)

## 4. UI Implementation
- [ ] **Login/Register Pages**: `/login`, `/register`
- [ ] **Dashboard**: Tenant-specific metrics
- [ ] **Products**: Multi-tenant CRUD
- [ ] **Settings**: Marketplace Integration Form (store keys securely)

## 5. Integrations (Strategy Pattern)
- [ ] `IMarketplaceAdapter` interface
- [ ] `MercadoLivreAdapter` (uses stored credentials)
- [ ] `ShopeeAdapter` (uses stored credentials)

## 6. Verification
- [ ] Register two distinct users (User A, User B)
- [ ] User A creates a product; Verify User B cannot see it
- [ ] User A saves credentials; Verify they are encrypted in DB
