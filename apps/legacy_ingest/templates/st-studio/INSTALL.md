# Guia Completo de Instalação

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior ([Download](https://nodejs.org/))
- **npm** 9.0.0 ou superior (vem com Node.js)
- **MongoDB** instalado localmente OU conta no **MongoDB Atlas** (recomendado)
- **Git** (opcional, para controle de versão)

### Verificar Instalações

```bash
# Verificar Node.js
node --version
# Deve mostrar: v18.x.x ou superior

# Verificar npm
npm --version
# Deve mostrar: 9.x.x ou superior

# Verificar MongoDB (se instalado localmente)
mongod --version
# Ou use MongoDB Atlas (recomendado para produção)
```

## 🚀 Instalação Passo a Passo

### 1. Clonar/Baixar o Projeto

Se você já tem o projeto, pule para o passo 2.

```bash
# Se usar Git
git clone <url-do-repositorio>
cd site-de-studio

# Ou simplesmente extraia o arquivo ZIP na pasta desejada
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install
```

**Tempo estimado**: 2-5 minutos (dependendo da conexão)

**O que acontece**:
- npm baixa todas as dependências listadas em `package.json`
- Cria a pasta `node_modules` com todas as bibliotecas
- Gera o arquivo `package-lock.json` (não edite manualmente)

**Possíveis avisos**:
- Avisos de depreciação são normais e não impedem o funcionamento
- Vulnerabilidades em dependências transitivas são de baixo risco
- Consulte `UPDATES.md` para mais detalhes

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# No Windows (PowerShell)
New-Item .env

# No Linux/Mac
touch .env
```

**Conteúdo do arquivo `.env`**:

```env
# ============================================
# MONGODB - Banco de Dados
# ============================================
# Opção 1: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/studio-beleza

# Opção 2: MongoDB Atlas (Recomendado para produção)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/studio-beleza?retryWrites=true&w=majority

# ============================================
# NEXTAUTH - Autenticação
# ============================================
# Gere uma chave secreta segura (use: openssl rand -base64 32)
NEXTAUTH_SECRET=sua-chave-secreta-aqui-mude-em-producao
NEXTAUTH_URL=http://localhost:3000

# ============================================
# WHATSAPP - Integração (Opcional)
# ============================================
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
# Formato: código do país + DDD + número (sem espaços ou caracteres especiais)

# ============================================
# ADMIN - Credenciais Padrão
# ============================================
ADMIN_EMAIL=admin@studio.com
ADMIN_PASSWORD=admin123

# ⚠️ IMPORTANTE: Altere essas credenciais após o primeiro login!
```

**Gerar NEXTAUTH_SECRET seguro**:

```bash
# No Linux/Mac
openssl rand -base64 32

# No Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 4. Configurar MongoDB

#### Opção A: MongoDB Local

1. **Instalar MongoDB**:
   - Windows: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Siga [instruções oficiais](https://docs.mongodb.com/manual/installation/)

2. **Iniciar MongoDB**:
   ```bash
   # Windows (como serviço)
   net start MongoDB
   
   # Linux/Mac
   mongod
   ```

3. **Verificar conexão**:
   ```bash
   mongosh
   # Deve conectar ao MongoDB
   ```

#### Opção B: MongoDB Atlas (Recomendado)

1. **Criar conta gratuita**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Criar cluster**:
   - Escolha o plano FREE (M0)
   - Selecione região mais próxima
   - Nome do cluster: `studio-beleza`
3. **Configurar acesso**:
   - Database Access → Criar usuário
   - Network Access → Adicionar IP (0.0.0.0/0 para desenvolvimento)
4. **Obter connection string**:
   - Clusters → Connect → Connect your application
   - Copie a string e substitua `<password>` pela senha do usuário
   - Cole no `.env` como `MONGODB_URI`

### 5. Inicializar Banco de Dados

#### Método 1: Via API (Recomendado)

1. Inicie o servidor:
   ```bash
   npm run dev
   ```

2. Acesse no navegador:
   ```
   http://localhost:3000/api/init
   ```

3. Você deve ver:
   ```json
   {"message":"Admin criado com sucesso","admin":{"email":"admin@studio.com"}}
   ```

#### Método 2: Via Script

```bash
# Configure as variáveis de ambiente primeiro
node scripts/init-admin.js
```

### 6. Popular com Dados de Exemplo (Opcional)

Para ter dados de exemplo (serviços e portfólio):

```bash
node scripts/seed-data.js
```

**O que isso faz**:
- Cria 6 serviços de exemplo
- Cria 3 itens de portfólio de exemplo
- Útil para testar a interface

### 7. Executar o Projeto

```bash
npm run dev
```

**Saída esperada**:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Ready in 2.3s
```

### 8. Acessar o Site

- **Site público**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin/login

## 🔐 Primeiro Acesso ao Admin

1. Acesse: `http://localhost:3000/admin/login`
2. Use as credenciais padrão:
   - **Email**: `admin@studio.com`
   - **Senha**: `admin123`
3. **⚠️ ALTERE A SENHA IMEDIATAMENTE** após o primeiro login!

## ✅ Verificação de Instalação

Execute este checklist:

- [ ] `npm install` executado sem erros críticos
- [ ] Arquivo `.env` criado e configurado
- [ ] MongoDB conectado (local ou Atlas)
- [ ] Admin inicializado (`/api/init` retornou sucesso)
- [ ] Servidor inicia sem erros (`npm run dev`)
- [ ] Site carrega em `http://localhost:3000`
- [ ] Login admin funciona
- [ ] Dados de exemplo carregados (se executou seed-data.js)

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

```bash
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "MongoDB connection failed"

- Verifique se MongoDB está rodando (local)
- Verifique a `MONGODB_URI` no `.env`
- Teste a conexão: `mongosh "sua-uri-aqui"`

### Erro: "Port 3000 already in use"

```bash
# Windows: Matar processo na porta 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac: Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou use outra porta
PORT=3001 npm run dev
```

### Erro: "NEXTAUTH_SECRET is not set"

- Certifique-se de que o arquivo `.env` existe
- Verifique se `NEXTAUTH_SECRET` está definido
- Reinicie o servidor após criar/editar `.env`

### Avisos de Vulnerabilidade

```bash
# Ver detalhes
npm audit

# As vulnerabilidades detectadas são de baixo risco
# Consulte UPDATES.md para mais informações
```

## 📦 Estrutura de Dependências

### Dependências Principais

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| next | ^14.2.5 | Framework React |
| react | ^18.3.1 | Biblioteca React |
| react-dom | ^18.3.1 | DOM renderer |
| mongodb | ^6.5.0 | Driver MongoDB |
| mongoose | ^8.5.1 | ODM para MongoDB |
| bcryptjs | ^2.4.3 | Hash de senhas |
| jsonwebtoken | ^9.0.2 | Tokens JWT |
| next-auth | ^4.24.7 | Autenticação |
| react-hook-form | ^7.52.1 | Formulários |
| zod | ^3.23.8 | Validação |
| lucide-react | ^0.378.0 | Ícones |
| date-fns | ^3.6.0 | Manipulação de datas |

### Dependências de Desenvolvimento

| Pacote | Versão | Descrição |
|--------|--------|-----------|
| typescript | ^5.5.4 | TypeScript |
| tailwindcss | ^3.4.7 | CSS framework |
| eslint | ^8.57.1 | Linter |
| eslint-config-next | ^14.2.5 | Config ESLint para Next.js |

## 🔄 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa ESLint

# Banco de Dados
node scripts/init-admin.js    # Criar admin
node scripts/seed-data.js     # Popular com dados exemplo

# Manutenção
npm outdated          # Ver pacotes desatualizados
npm update           # Atualizar pacotes (cuidado!)
npm audit            # Verificar vulnerabilidades
```

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Leia [TESTING.md](./TESTING.md) para testar a interface
2. ✅ Configure [HOSPEDAGEM.md](./HOSPEDAGEM.md) para deploy
3. ✅ Personalize o site com suas informações
4. ✅ Configure integração WhatsApp (opcional)

## 🆘 Suporte

- **Documentação Next.js**: https://nextjs.org/docs
- **Documentação MongoDB**: https://docs.mongodb.com
- **Issues do projeto**: Abra uma issue no repositório
