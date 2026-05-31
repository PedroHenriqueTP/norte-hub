# AutoShop SaaS

**High-Performance Multi-tenant SaaS for Automotive Shops.**

This project is a Next.js 16 application built with Supabase, Tailwind CSS, and TypeScript. It features a multi-tenant architecture where each automotive shop gets its own dedicated subdomain and dashboard.

## 🚀 Key Features

- **Multi-tenancy**:
  - `app.autoshop.com`: Main application dashboard for tenants.
  - `[tenant].autoshop.com`: Public-facing site for each shop.
  - `admin.autoshop.com`: Super Admin control tower.
- **Authentication**: Robust Supabase Auth integration with role-based access control (RBAC).
- **Design System**: "Light & Clean" aesthetic using Tailwind CSS and Radix UI primitives.
- **Performance**: Optimized with Next.js App Router and Server Components.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

- `/app`: App Router source.
  - `(marketing)`: Public landing page.
  - `app`: Authenticated dashboard routes.
  - `admin`: Super Admin routes.
  - `site`: Tenant public pages.
- `/lib`: Shared utilities and Supabase clients.
- `/components`: Reusable UI components.

## 🚦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create `.env.local` with:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **User Setup (Important)**:
    -   Since the `SUPABASE_SERVICE_ROLE_KEY` is not available, you must manually promote a user to Super Admin.
    -   **Step 1**: Sign up a new user at `http://localhost:3000/app/login` (e.g., `admin@autoshop.com`).
    -   **Step 2**: Open your Supabase Dashboard -> SQL Editor.
    -   **Step 3**: Copy and run the content of `supabase/create_admin.sql`.

6.  **Access Points**:
    -   Landing: `http://localhost:3000`
    -   Login: `http://localhost:3000/app/login`
    -   **Admin Dashboard**: `http://admin.localhost:3000` or via `/admin` route.
    -   Tenant Site: `http://store.localhost:3000` (Requires hosts file mapping)

## 🔐 Roles & Permissions

- **Super Admin**: Full access to all SaaS metrics and tenant management.
- **Tenant Admin**: Manages their specific shop (vehicles, sales, settings).

---
*Maintained by the AutoShop Tech Team.*
