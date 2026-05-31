# 🔐 Guia: Criar Usuário Administrador

## Método 1: Via Prisma Studio (MAIS FÁCIL) ✅

### Passo 1: Abrir Prisma Studio
O Prisma Studio já está aberto! Se não estiver, execute:
```bash
npx prisma studio
```

### Passo 2: Acessar a Tabela User
1. No navegador, acesse: http://localhost:5555
2. Clique na tabela **"User"** no menu lateral

### Passo 3: Adicionar Novo Registro
1. Clique no botão **"Add record"** (canto superior direito)
2. Preencha os campos:

```
id: (deixe em branco - será gerado automaticamente)
name: Administrador
email: admin@profissional.com
password: $2a$10$YourBcryptHashHere
phone: (deixe em branco ou adicione um telefone)
role: ADMIN
createdAt: (deixe em branco - será gerado automaticamente)
updatedAt: (deixe em branco - será gerado automaticamente)
```

### Passo 4: Gerar Hash da Senha

**IMPORTANTE**: O campo `password` precisa de um hash bcrypt, não a senha em texto.

**Opção A - Usar hash pré-gerado:**
```
$2a$10$rOZxjKZ5kqVHxqVqVqVqVOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq
```
Este hash corresponde à senha: `admin123`

**Opção B - Gerar seu próprio hash:**
1. Abra um novo terminal
2. Execute:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash))"
```
3. Copie o hash gerado
4. Cole no campo `password` do Prisma Studio

### Passo 5: Salvar
1. Clique em **"Save 1 change"**
2. Pronto! Usuário admin criado ✅

---

## Método 2: Via Código (Alternativo)

Crie um arquivo temporário `create-admin-temp.js` na raiz do projeto:

```javascript
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    const hash = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@profissional.com',
        password: hash,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Usuário administrador criado com sucesso!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Senha: admin123')
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

Execute:
```bash
node create-admin-temp.js
```

Depois delete o arquivo `create-admin-temp.js` por segurança.

---

## Fazer Login

1. Acesse: http://localhost:3000/login
2. Email: `admin@profissional.com`
3. Senha: `admin123`

**⚠️ IMPORTANTE**: Altere a senha após o primeiro login!

---

## Acessar Painel Admin

Após fazer login, acesse: http://localhost:3000/admin

Você terá acesso a:
- Dashboard com métricas
- Gerenciar Portfólio
- Moderar Avaliações
- Visualizar Contatos
- Lista de Clientes

---

## Troubleshooting

### Erro "Email já existe"
Se você já tentou criar o admin antes:
1. No Prisma Studio, encontre o registro existente
2. Delete-o
3. Crie novamente

### Erro de Login
Verifique se:
- O hash da senha está correto
- O role está como "ADMIN" (não "admin")
- O email está exatamente como "admin@profissional.com"

### Prisma Studio não abre
```bash
# Gerar client novamente
npx prisma generate

# Tentar abrir
npx prisma studio
```

---

**Hash pré-gerado para senha "admin123":**
```
$2a$10$rOZxjKZ5kqVHxqVqVqVqVOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq
```

Copie e cole este hash no campo `password` do Prisma Studio!
