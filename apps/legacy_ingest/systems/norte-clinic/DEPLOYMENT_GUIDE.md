# Guia de Hospedagem (Deployment)

Este guia cobre a preparação e deploy da aplicação CRM Médico em ambiente de produção.

## 1. Arquitetura de Produção

-   **Frontend**: Next.js (Hospedagem Recomendada: Vercel)
-   **Backend**: FastAPI (Hospedagem Recomendada: Railway, Render, ou VPS com Docker)
-   **Banco de Dados**: PostgreSQL Gerenciado (Supabase, Neon, ou Docker em VPS)
-   **Cache/Fila**: Redis (Upstash ou Docker em VPS)

---

## 2. Preparação (Environment Variables)

### Backend (`.env.production`)
Crie este arquivo no servidor/serviço de backend.

```ini
PROJECT_NAME=MedCura CRM
API_V1_STR=/api/v1
# Gere uma chave segura: openssl rand -hex 32
SECRET_KEY=sua-chave-super-secreta-producao
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Database (Exemplo para Supabase/Neon)
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
POSTGRES_SERVER=host
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=dbname

# MongoDB (Logs)
MONGO_URL=mongodb+srv://...

# Redis
REDIS_URL=redis://...

# AI
GOOGLE_API_KEY=sua-chave-gemini-prod

# CORS Config (Domínio do Frontend)
BACKEND_CORS_ORIGINS=["https://seu-app-crm.vercel.app"]
```

### Frontend (`.env.local` no Vercel)
Configure nas variáveis de ambiente do projeto na Vercel.

```ini
NEXT_PUBLIC_API_URL=https://seu-backend-api.com
```

---

## 3. Passo a Passo de Deploy

### Opção A: Deploy Simples (PaaS)

#### Passo 1: Banco de Dados
1.  Crie um projeto no **Supabase** ou **Neon.tech**.
2.  Pegue a Connection String (compatível com SQLAlchemy/Postgres).

#### Passo 2: Backend (Railway/Render)
1.  Conecte seu repositório GitHub.
2.  Configure o Build Command: `pip install -r requirements.txt`
3.  Configure o Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4.  Adicione as Variáveis de Ambiente (`DATABASE_URL`, `SECRET_KEY`, etc.).

#### Passo 3: Frontend (Vercel)
1.  Importe o projeto do GitHub.
2.  Configure o `Root Directory` para `frontend`.
3.  Adicione a variavel `NEXT_PUBLIC_API_URL` apontando para a URL do backend criada no Passo 2.
4.  Deploy!

### Opção B: Deploy Docker (VPS - DigitalOcean/AWS)

Ideal para controle total e custos fixos.

1.  **Provisione um servidor** (Ubuntu 22.04).
2.  **Instale Docker e Docker Compose**.
3.  **Clone o repositório**.
4.  **Ajuste `docker-compose.prod.yml`**:
    -   Remova build local do frontend se for usar Vercel, ou configure Nginx para servir o build estático.
    -   Use volumes persistentes para Postgres/Mongo se rodar no mesmo servidor.
5.  **Execute**:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```
6.  **Configurar Domínio/SSL**:
    -   Use Nginx Proxy Manager ou Traefik para gerenciar SSL (Let's Encrypt).

---

## 4. Pós-Deploy Checklist

- [ ] Verificar se as tabelas do banco foram criadas (Alembic migrations ou startup script).
- [ ] Criar primeiro usuário admin via script ou acesso direto ao banco.
- [ ] Testar fluxo de Login em produção.
- [ ] Verificar logs do backend para erros de conexão.
