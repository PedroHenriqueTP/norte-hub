# Guia de Arquivos e Estrutura

Esta é a estrutura principal do projeto e onde encontrar cada funcionalidade.

## Frontend (`/frontend`)
- `app/`: Rotas do Next.js (App Router).
    - `page.tsx`: Landing Page / Login.
    - `dashboard/`: Área logada principal.
        - `layout.tsx`: Layout principal com Sidebar e UserHeader.
        - `patients/`: Cadastro e listagem de pacientes.
        - `calendar/`: Agenda médica completa.
        - `consultations/`: Prontuário eletrônico.
        - `financial/`: Módulo financeiro do médico.
        - `chat/`: Sistema de chat interno.
    - `admin/`: **[NOVO]** Área administrativa (Dashboard, Usuários, Configs).
- `components/`: Componentes React reutilizáveis.
    - `ui/`: Componentes base (Botões, Inputs, Modals) - Shadcn.
    - `Sidebar.tsx`: Navegação lateral principal.
    - `AdminSidebar.tsx`: Navegação lateral do Admin.
- `lib/`: Utilitários (axios, cn, formatters).

## Backend (`/backend`)
- `app/`: Código fonte da aplicação.
    - `api/v1/endpoints/`: Controladores da API (Rotas).
        - `users.py`: Gestão de usuários.
        - `patients.py`: Gestão de pacientes.
        - `appointments.py`: Agendamentos.
        - `billing.py`: **[NOVO]** Assinaturas e Planos.
        - `admin.py`: (Se houver) Rotas específicas de admin.
    - `models/`: Modelos do Banco de Dados (ORM SQLAlchemy).
        - `user.py`: Usuário e Perfis.
        - `subscription.py`: **[NOVO]** Modelos de Assinatura.
    - `schemas/`: Schemas Pydantic (Validação de I/O).
    - `core/`: Configurações (Security, Config).
- `alembic/`: Migrações de banco de dados.

## Pontos Chave de Customização
- **Adicionar Campos no Paciente**: 
    1. Editar `backend/app/models/patient.py`.
    2. Editar `backend/app/schemas/patient.py`.
    3. Atualizar form em `frontend/app/dashboard/patients/page.tsx`.
- **Alterar Permissões**:
    - Backend: Decorators em `endpoints/` (ex: `current_user.role != 'admin'`).
    - Frontend: `Sidebar.tsx` (lista `roles`) e `layout.tsx` (guards).
