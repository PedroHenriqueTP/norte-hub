# Site Profissional - Guia de Início Rápido

## 🚀 Projeto Iniciado!

Site profissional minimalista desenvolvido com Next.js 14, TypeScript, e Tailwind CSS.

## 📋 Status Atual

### ✅ Fases 1, 2 e 3 Concluídas
- Next.js 14 com TypeScript configurado
- Tailwind CSS com design system profissional
- Prisma 7 com SQLite (desenvolvimento)
- NextAuth.js para autenticação
- **8 páginas públicas** funcionais
- **5 páginas admin** completas
- **10 APIs** implementadas

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Banco de Dados**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma 7
- **Autenticação**: NextAuth.js
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Ícones**: Lucide React

## 📦 Instalação e Execução

### 1. Instalar Dependências
```bash
npm install
```

### 2. Gerar Prisma Client
```bash
npx prisma generate
```

### 3. Criar Banco de Dados
```bash
npx prisma migrate dev
```

### 4. Criar Usuário Administrador

**Opção 1 - Via Prisma Studio (Recomendado):**
```bash
npx prisma studio
```

No Prisma Studio:
1. Abra a tabela `User`
2. Clique em "Add record"
3. Preencha:
   - **name**: Administrador
   - **email**: admin@profissional.com
   - **password**: `$2a$10$rOZxjKZ5kqVHxqVqVqVqVOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq` (hash de "admin123")
   - **role**: ADMIN
4. Salve

**Opção 2 - Criar manualmente via código:**

Crie um arquivo temporário `create-admin-temp.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  console.log('Hash gerado:', hash)
  console.log('\nUse este hash no Prisma Studio!')
  
  // Ou criar diretamente:
  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@profissional.com',
      password: hash,
      role: 'ADMIN'
    }
  })
  console.log('✅ Admin criado!')
}

main().finally(() => prisma.$disconnect())
```

Execute: `node create-admin-temp.js`

### 5. Iniciar Servidor
```bash
npm run dev
```

O site estará disponível em: **http://localhost:3000**

### 6. Fazer Login como Admin
- Acesse: http://localhost:3000/login
- Email: `admin@profissional.com`
- Senha: `admin123`
- Painel Admin: http://localhost:3000/admin

## 🎨 Design System

### Paleta de Cores
- **Primary**: #2C3E50 (Azul escuro profissional)
- **Secondary**: #34495E (Cinza azulado)
- **Accent**: #3498DB (Azul confiança)
- **Success**: #27AE60 (Verde)
- **Background**: #FFFFFF (Branco limpo)

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700

## 📁 Estrutura do Projeto

```
site-de-profissional/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth + Register
│   │   ├── contact/        # Formulário contato
│   │   ├── user/           # Perfil usuário
│   │   └── admin/          # APIs admin
│   ├── admin/              # Painel Admin
│   ├── avaliacoes/         # Página Avaliações
│   ├── cadastro/           # Página Cadastro
│   ├── contato/            # Página Contato
│   ├── login/              # Página Login
│   ├── perfil/             # Página Perfil
│   ├── portfolio/          # Página Portfólio
│   ├── servicos/           # Página Serviços
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Página Home
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Cabeçalho
│   │   └── Footer.tsx      # Rodapé
│   ├── AuthProvider.tsx    # Provider NextAuth
│   ├── ProfileForm.tsx     # Form perfil
│   └── WhatsAppButton.tsx  # Botão flutuante
├── lib/
│   ├── prisma.ts           # Cliente Prisma
│   ├── validations.ts      # Schemas Zod
│   └── whatsapp.ts         # Helpers WhatsApp
├── prisma/
│   ├── schema.prisma       # Schema do banco
│   └── migrations/         # Migrações
├── types/
│   └── next-auth.d.ts      # Tipos NextAuth
└── middleware.ts           # Proteção de rotas
```

## 🗄️ Modelos do Banco de Dados

- **User**: Usuários (clientes e admin)
- **Project**: Projetos do portfólio
- **Review**: Avaliações de clientes
- **ContactForm**: Formulários de contato
- **Appointment**: Agendamentos
- **Analytics**: Métricas do dashboard

## 🔐 Autenticação

NextAuth.js configurado com:
- Provider de credenciais (email/senha)
- Proteção de rotas via middleware
- Roles: CLIENT e ADMIN

##  Troubleshooting

### Erro de Prisma Client
```bash
npx prisma generate
```

### Erro de Migração
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Limpar Cache do Next.js
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

### Problemas com npm
```bash
# Limpar cache
npm cache clean --force

# Reinstalar dependências
Remove-Item -Recurse -Force node_modules
npm install
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação completa.

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para uso
