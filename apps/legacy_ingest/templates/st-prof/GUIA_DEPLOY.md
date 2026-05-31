# 🚀 Guia de Deploy e Hospedagem

## 🎯 Opções de Hospedagem

### Recomendadas para Next.js

1. **Vercel** ⭐ (Recomendado)
   - Criadores do Next.js
   - Deploy automático
   - Grátis para projetos pessoais
   - CDN global
   - Suporte a Edge Functions

2. **Railway**
   - Fácil configuração
   - PostgreSQL incluído
   - $5/mês (tier gratuito disponível)
   - Deploy via Git

3. **Netlify**
   - Interface amigável
   - CI/CD integrado
   - Tier gratuito generoso

4. **AWS / Google Cloud / Azure**
   - Máximo controle
   - Escalabilidade
   - Mais complexo

---

## 🚀 Deploy na Vercel (Recomendado)

### Pré-requisitos
- Conta no GitHub
- Conta na Vercel (vercel.com)
- Projeto no GitHub

### Passo 1: Preparar Projeto

#### 1.1 Criar Repositório no GitHub
```bash
# Inicializar Git (se ainda não fez)
git init
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e conectar
git remote add origin https://github.com/seu-usuario/site-profissional.git
git branch -M main
git push -u origin main
```

#### 1.2 Atualizar .gitignore
Certifique-se de que `.gitignore` inclui:
```
# Secrets
.env
.env.local
.env.production
CREDENCIAIS.md

# Database
*.db
*.db-journal

# Next.js
.next/
out/
build/

# Dependencies
node_modules/

# Logs
*.log
```

#### 1.3 Configurar para Produção

**package.json** - Adicionar scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### Passo 2: Deploy na Vercel

#### 2.1 Importar Projeto
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Vercel detectará Next.js automaticamente

#### 2.2 Configurar Variáveis de Ambiente
No painel da Vercel, vá em **Settings > Environment Variables**:

```env
# Database (use PostgreSQL em produção)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# NextAuth
NEXTAUTH_URL=https://seu-site.vercel.app
NEXTAUTH_SECRET=[gerar novo com: openssl rand -base64 32]

# WhatsApp
BUSINESS_WHATSAPP_NUMBER=+5511999999999

# Opcional: Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**⚠️ IMPORTANTE**: Gere um novo `NEXTAUTH_SECRET` para produção!

#### 2.3 Configurar PostgreSQL

**Opção A - Vercel Postgres:**
1. No projeto Vercel, vá em "Storage"
2. Crie um "Postgres Database"
3. Copie a `DATABASE_URL` gerada
4. Adicione nas Environment Variables

**Opção B - Supabase (Grátis):**
1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. Copie a connection string
4. Use como `DATABASE_URL`

**Opção C - Railway:**
1. Crie conta em [railway.app](https://railway.app)
2. Crie PostgreSQL database
3. Copie connection string

#### 2.4 Deploy
1. Clique em "Deploy"
2. Aguarde build (2-5 minutos)
3. Vercel fornecerá URL: `https://seu-site.vercel.app`

### Passo 3: Configurar Banco de Dados em Produção

#### 3.1 Rodar Migrações
```bash
# Localmente, com DATABASE_URL de produção
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

Ou adicione script no `package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

#### 3.2 Criar Admin em Produção

**Via Prisma Studio:**
```bash
# Conectar ao banco de produção
DATABASE_URL="postgresql://..." npx prisma studio
```

Ou criar script de seed:
```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('SuaSenhaForte123!', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@seudominio.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@seudominio.com',
      password: hash,
      role: 'ADMIN'
    }
  })
}

main().finally(() => prisma.$disconnect())
```

Execute:
```bash
DATABASE_URL="postgresql://..." node prisma/seed.js
```

### Passo 4: Configurar Domínio Personalizado

#### 4.1 Adicionar Domínio na Vercel
1. Settings > Domains
2. Adicione seu domínio (ex: `seusite.com.br`)
3. Vercel fornecerá registros DNS

#### 4.2 Configurar DNS
No seu provedor de domínio (Registro.br, GoDaddy, etc):

**Tipo A:**
```
@ -> 76.76.21.21
```

**Tipo CNAME:**
```
www -> cname.vercel-dns.com
```

#### 4.3 Atualizar NEXTAUTH_URL
```env
NEXTAUTH_URL=https://seusite.com.br
```

---

## 🚂 Deploy no Railway

### Passo 1: Criar Projeto
1. Acesse [railway.app](https://railway.app)
2. "New Project" > "Deploy from GitHub repo"
3. Selecione seu repositório

### Passo 2: Adicionar PostgreSQL
1. "New" > "Database" > "PostgreSQL"
2. Railway criará automaticamente
3. Copie `DATABASE_URL` das variáveis

### Passo 3: Configurar Variáveis
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_URL=https://seu-app.up.railway.app
NEXTAUTH_SECRET=[gerar novo]
BUSINESS_WHATSAPP_NUMBER=+5511999999999
```

### Passo 4: Deploy
Railway fará deploy automaticamente a cada push no GitHub.

---

## 🌐 Deploy no Netlify

### Passo 1: Configurar Build
Crie `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Passo 2: Conectar Repositório
1. Acesse [netlify.com](https://netlify.com)
2. "New site from Git"
3. Selecione repositório

### Passo 3: Configurar Variáveis
Em Site settings > Environment variables, adicione todas as variáveis.

### Passo 4: Deploy
Netlify fará build e deploy automaticamente.

---

## 📊 Monitoramento e Manutenção

### Logs
**Vercel:**
- Dashboard > Deployments > Logs
- Real-time logs disponíveis

**Railway:**
- Dashboard > Deployments > View Logs

### Analytics
**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Backups
**PostgreSQL:**
- Configure backups automáticos
- Vercel Postgres: backups automáticos
- Supabase: backups diários
- Railway: snapshots manuais

---

## 🔒 Checklist de Segurança Pré-Deploy

- [ ] `.env` no `.gitignore`
- [ ] Novo `NEXTAUTH_SECRET` gerado
- [ ] Senhas fortes em produção
- [ ] HTTPS habilitado (automático na Vercel)
- [ ] CORS configurado corretamente
- [ ] Rate limiting considerado
- [ ] Variáveis sensíveis não no código
- [ ] Dependências atualizadas
- [ ] Sem console.logs sensíveis

---

## 🎯 Checklist Pré-Deploy

### Código
- [ ] Build local funciona (`npm run build`)
- [ ] Sem erros TypeScript
- [ ] Sem warnings críticos
- [ ] Testes passando
- [ ] Lighthouse > 80

### Configuração
- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL configurado
- [ ] Migrações rodadas
- [ ] Admin criado
- [ ] Domínio configurado (se aplicável)

### Conteúdo
- [ ] Informações de contato atualizadas
- [ ] Número WhatsApp correto
- [ ] Links de redes sociais corretos
- [ ] Textos revisados
- [ ] Imagens otimizadas

---

## 🔄 CI/CD Automático

### GitHub Actions (Opcional)
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm run test # se tiver testes
```

---

## 📈 Pós-Deploy

### 1. Verificar Site
- [ ] Acessar URL de produção
- [ ] Testar todas as páginas
- [ ] Fazer login como admin
- [ ] Testar formulários
- [ ] Verificar responsividade

### 2. Configurar Monitoramento
- [ ] Google Analytics
- [ ] Vercel Analytics
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring

### 3. SEO
- [ ] Google Search Console
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Meta tags

### 4. Performance
- [ ] Lighthouse audit
- [ ] PageSpeed Insights
- [ ] WebPageTest

---

## 💰 Custos Estimados

### Tier Gratuito (Início)
- **Vercel**: Grátis (100GB bandwidth/mês)
- **Supabase**: Grátis (500MB database)
- **Domínio**: R$ 40/ano (.com.br)
- **Total**: ~R$ 40/ano

### Tier Pago (Crescimento)
- **Vercel Pro**: $20/mês
- **Supabase Pro**: $25/mês
- **Domínio**: R$ 40/ano
- **Total**: ~R$ 310/mês

---

## 🆘 Troubleshooting Deploy

### Build Falha
```bash
# Testar build localmente
npm run build

# Verificar logs na Vercel
# Dashboard > Deployments > Build Logs
```

### Erro de Database
```bash
# Verificar connection string
# Testar conexão local
DATABASE_URL="postgresql://..." npx prisma db push
```

### Variáveis não Funcionam
- Verificar se estão em "Production"
- Redeploy após adicionar variáveis
- Verificar nomes exatos (case-sensitive)

---

**Última atualização**: Janeiro 2026  
**Tempo estimado de deploy**: 30-60 minutos  
**Dificuldade**: Intermediário
