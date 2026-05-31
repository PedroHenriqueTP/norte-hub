# 🏥 MedCura CRM - Documentação Técnica (v2.0)

## 🚀 Visão Geral
Sistema SaaS Multi-tenant para gestão clínica de alto desempenho, focado em segurança de dados e experiência do usuário profissional (White/Light Theme).

## 🛠 Stack Tecnológica
- **UI/UX:** Design System Premium baseado em `Inter` (texto) e `Geist Mono`/`JetBrains Mono` (dados técnicos).
- **Frontend:** Next.js 16 (Turbopack) com arquitetura de componentes modulares.
- **Estilização:** Tailwind CSS, Framer Motion, shadcn/ui.
- **Inteligência:** MedCura Co-Pilot (Chatbot AI) com suporte a funções de Admin e Clínica.
- **Backend:** FastAPI (Python), SQLAlchemy 2.0 (Async), Alembic.
- **Banco de Dados:** PostgreSQL, Redis (Cache/Queue).
- **Segurança:**
  - Middleware de isolamento de Tenant (Clinic ID).
  - Decorador de Auditoria (`audit_action`) para logs imutáveis.
  - Autenticação baseada em Scopes JWT e RBAC.

## 📁 Estrutura de Diretórios Polida
- `/backend`: API FastAPI, models, core logic e migrações.
- `/frontend`: Aplicação Next.js, componentes e Dashboard.
- `/scripts`: Atalhos de automação (PowerShell/Batch) e limpeza.
- `/docs`: Manuais de API e Guia de Design.

## 🛡️ Protocolos de Segurança
- **Audit Logs**: Todas as ações críticas (Create/Update/Delete) em recursos sensíveis são registradas.
- **Multi-tenancy**: Filtragem obrigatória por `owner_id` ou `clinic_id` em queries de banco.
- **Access Control**: Decorators `@superuser_required` para rotas de administração global.

## 🤖 MedCura Co-Pilot (Admin Mode)
O Chatbot possui um prompt de sistema especializado para atuar como Analista de BI, capaz de ler métricas de faturamento e logs de erro, mas restrito a não cruzar dados de pacientes entre tenants.
