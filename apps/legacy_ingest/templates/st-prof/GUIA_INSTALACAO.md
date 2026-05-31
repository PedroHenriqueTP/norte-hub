# 📦 Guia de Instalação Completo

## 🎯 Pré-requisitos

### Software Necessário
- **Node.js**: Versão 20.x ou superior
- **npm**: Versão 10.x ou superior (vem com Node.js)
- **Git**: Para controle de versão
- **Editor de Código**: VS Code (recomendado)

### Verificar Instalações
```bash
node --version    # Deve mostrar v20.x ou superior
npm --version     # Deve mostrar v10.x ou superior
git --version     # Qualquer versão recente
```

---

## 📥 Passo 1: Clonar/Baixar o Projeto

### Se estiver usando Git:
```bash
cd C:\Users\ACER\Desktop
git clone [url-do-repositorio] site-de-profissional
cd site-de-profissional
```

### Se baixou como ZIP:
1. Extraia o arquivo ZIP
2. Abra o terminal na pasta do projeto

---

## 📦 Passo 2: Instalar Dependências

```bash
npm install
```

**Tempo estimado**: 2-5 minutos

### Possíveis Problemas:

**Erro de permissão:**
```bash
npm cache clean --force
npm install
```

**Erro de rede:**
```bash
npm install --registry=https://registry.npmjs.org/
```

---

## 🗄️ Passo 3: Configurar Banco de Dados

### 3.1 Gerar Prisma Client
```bash
npx prisma generate
```

### 3.2 Criar Banco de Dados
```bash
npx prisma migrate dev --name init
```

Isso criará o arquivo `prisma/dev.db` com todas as tabelas.

### 3.3 Verificar (Opcional)
```bash
npx prisma studio
```
Abrirá interface visual em http://localhost:5555

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Criar arquivo .env.local
Crie um arquivo chamado `.env.local` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-minimo-32-caracteres"

# WhatsApp
BUSINESS_WHATSAPP_NUMBER="+5511999999999"
```

### 4.2 Gerar NEXTAUTH_SECRET
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou use qualquer string aleatória com 32+ caracteres
```

---

## 👤 Passo 5: Criar Usuário Administrador

### Método 1: Via Prisma Studio (Recomendado)

1. **Abrir Prisma Studio:**
```bash
npx prisma studio
```

2. **Acessar**: http://localhost:5555

3. **Criar Admin:**
   - Clique em "User"
   - Clique em "Add record"
   - Preencha:
     ```
     name: Administrador
     email: admin@profissional.com
     password: $2a$10$rOZxjKZ5kqVHxqVqVqVqVOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq
     role: ADMIN
     ```
   - Salve

### Método 2: Via Script

Crie arquivo `create-admin.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
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

Execute:
```bash
node create-admin.js
```

---

## 🚀 Passo 6: Iniciar Aplicação

```bash
npm run dev
```

**Aguarde a mensagem:**
```
▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
```

---

## ✅ Passo 7: Verificar Instalação

### 7.1 Acessar o Site
Abra o navegador em: http://localhost:3000

**Deve ver:**
- Página Home com hero section
- Header com navegação
- Footer completo
- Botão WhatsApp flutuante

### 7.2 Testar Login
1. Acesse: http://localhost:3000/login
2. Email: `admin@profissional.com`
3. Senha: `admin123`
4. Deve redirecionar para Home logado

### 7.3 Acessar Painel Admin
1. Acesse: http://localhost:3000/admin
2. Deve ver dashboard com métricas

---

## 🎨 Passo 8: Personalizar (Opcional)

### Alterar Informações de Contato
Edite `components/layout/Footer.tsx`:
```tsx
// Linha ~20
<p className="text-sm">
  Profissional dedicado a oferecer serviços...
</p>

// Linha ~40
<Phone className="h-4 w-4" />
<span>(11) 99999-9999</span>
```

### Alterar Número WhatsApp
Edite `.env.local`:
```env
BUSINESS_WHATSAPP_NUMBER="+5511999999999"
```

### Alterar Cores
Edite `app/globals.css`:
```css
:root {
  --primary: #2C3E50;
  --accent: #3498DB;
  /* ... */
}
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Iniciar servidor dev
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run lint         # Verificar código
```

### Prisma
```bash
npx prisma studio           # Interface visual
npx prisma generate         # Gerar client
npx prisma migrate dev      # Criar migração
npx prisma migrate reset    # Resetar banco
npx prisma db push          # Sincronizar schema
```

### Limpeza
```bash
# Limpar cache Next.js
Remove-Item -Recurse -Force .next

# Limpar node_modules
Remove-Item -Recurse -Force node_modules
npm install

# Resetar banco de dados
npx prisma migrate reset
```

---

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```bash
npm install
npx prisma generate
```

### Erro: "Port 3000 already in use"
```bash
# Matar processo na porta 3000
npx kill-port 3000

# Ou usar outra porta
PORT=3001 npm run dev
```

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Erro: "Database locked"
```bash
# Fechar Prisma Studio
# Reiniciar aplicação
npm run dev
```

### Site não carrega CSS
```bash
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📋 Checklist de Instalação

- [ ] Node.js 20+ instalado
- [ ] Projeto baixado/clonado
- [ ] `npm install` executado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma migrate dev` executado
- [ ] `.env.local` criado e configurado
- [ ] Usuário admin criado
- [ ] `npm run dev` funcionando
- [ ] Site acessível em localhost:3000
- [ ] Login funcionando
- [ ] Painel admin acessível

---

## 🎓 Próximos Passos

1. **Alterar senha do admin** (importante!)
2. **Adicionar projetos ao portfólio**
3. **Personalizar informações de contato**
4. **Testar formulários**
5. **Preparar para produção** (ver GUIA_DEPLOY.md)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o checklist acima
2. Consulte a seção "Solução de Problemas"
3. Veja os logs no terminal
4. Verifique o arquivo CREDENCIAIS.md

---

**Tempo total estimado**: 15-30 minutos  
**Dificuldade**: Iniciante  
**Última atualização**: Janeiro 2026
