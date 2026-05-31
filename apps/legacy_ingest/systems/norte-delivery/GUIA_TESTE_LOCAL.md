# 🚀 Guia Atualizado para Teste Local

Este guia descreve o processo correto para configurar e rodar a aplicação localmente, após a limpeza da estrutura de diretórios.

## 📋 Pré-requisitos

1.  **Node.js**: Versão 18 ou superior.
2.  **PostgreSQL**: Rodando localmente ou via Docker.
3.  **Terminal**: PowerShell (Windows) ou Bash.

---

## 🔧 Passo 1: Configuração do Banco de Dados

### 1.1 Configurar Variáveis de Ambiente
Crie o arquivo `.env` na pasta `apps/api`:

**Caminho:** `apps/api/.env`
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/delivery_db?schema=public"
PORT=3333
JWT_SECRET="seu_segredo_super_seguro"
```
*Ajuste `usuario` e `senha` conforme seu PostgreSQL local.*

### 1.2 Instalar Dependências e Migrar Banco
Abra um terminal na raiz do projeto (`delivery-platform`) e execute:

```powershell
# Instalar dependências da API
cd apps/api
npm install

# Gerar cliente Prisma e criar tabelas
npm run db:generate
npm run db:migrate
```

---

## 🖥️ Passo 2: Iniciar os Serviços

## 🖥️ Passo 2: Iniciar os Serviços

Execute os comandos abaixo em terminais separados na raiz do projeto:

### 1. Iniciar o Backend (API)

```powershell
# Navegar para a pasta da API
cd apps/api

# Iniciar o servidor de desenvolvimento
npm run start:dev
```
*A API estará rodando em: `http://localhost:3333`*

### 2. Iniciar o Frontend (Web)

```powershell
# Navegar para a pasta Web
cd apps/web

# Iniciar o servidor de desenvolvimento
npm run dev
```
*O site estará acessível em: `http://localhost:3000`*

---

## 🧪 Passo 3: Verificação

1.  **Acesse o Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
2.  **Acesse o App do Garçom:** [http://localhost:3000/garcom](http://localhost:3000/garcom)
3.  **Teste a API:** [http://localhost:3333/health](http://localhost:3333/health) (ou tente acessar `/orders` se a rota existir)

## 🧪 Rodando Testes

Para garantir que o backend está configurado corretamente:

```powershell
cd apps/api
npm test
```
*Se retornar "No tests found", significa que a configuração está correta, mas ainda não há testes unitários criados.*

---

## 🐛 Problemas Comuns

-   **Erro de Conexão DB**: Verifique se o Postgres está rodando e se a senha no `.env` está correta.
-   **Porta em uso**: Se a porta 3333 ou 3000 estiver ocupada, feche os processos Node no Gerenciador de Tarefas ou altere a porta no `.env` (para API).
-   **Prisma ClientError**: Se encontrar erros de tipo ou módulo não encontrado do Prisma, rode `npm run db:generate` novamente dentro de `apps/api`.
