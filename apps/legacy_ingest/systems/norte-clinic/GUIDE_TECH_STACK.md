# Tech Stack Documentação

## Core Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Python FastAPI
- **Database**: PostgreSQL (via SQLAlchmey + AsyncPG)
- **State Mgmt**: React Query (TanStack Query)
- **Styling**: TailwindCSS + Shadcn/ui

## Key Libraries & Tools
### Frontend
- `lucide-react`: Icon set.
- `react-hook-form` + `zod`: Forms validation.
- `react-day-picker`: Calendar components.
- `date-fns`: Date manipulation.
- `axios`: HTTP Client.
- `sonner`: Toast notifications.

### Backend
- `pydantic`: Data validation schemas.
- `alembic`: Database migrations.
- `python-jose`: JWT Token handling.
- `passlib`: Password hashing.
- `uvicorn`: ASGI Server.

## Architecture Patterns
- **API First**: Frontend consumes REST API via `useQuery` hooks.
- **Role-Based Access**: Backend checks `user.role` in endpoints; Frontend protects routes via `layout.tsx` checks.
- **Component Driven**: UI built with atomic components from `shadcn`.

## Dev Environment
- **Docker**: Optional for DB.
- **Node**: v18+
- **Python**: 3.10+
