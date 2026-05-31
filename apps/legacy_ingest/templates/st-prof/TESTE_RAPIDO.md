# 🧪 Guia Rápido de Teste - Passo a Passo

## ✅ Pré-requisitos Verificados

- [x] npm run dev rodando (porta 3000)
- [x] Prisma Studio aberto (porta 51212)
- [x] Banco de dados SQLite configurado
- [x] .env.local configurado

---

## 📝 PASSO 1: Criar Usuário Admin

### Via Prisma Studio (VOCÊ ESTÁ AQUI!)

**O Prisma Studio já está aberto em:** http://localhost:51212/#table=User

**Siga estes passos:**

1. ✅ Você já está na tabela "User"
2. Clique no botão **"Add record"** (canto superior direito)
3. Preencha os campos:
   ```
   name: Administrador
   email: admin@profissional.com  
   password: $2a$10$rOZxjKZ5kqVHxqVqVqVqVOqVqVqVqVqVqVqVqVqVqVqVqVqVqVqVq
   role: ADMIN
   ```
   
   **IMPORTANTE**: 
   - Deixe `id`, `phone`, `createdAt` e `updatedAt` em branco
   - O password é um hash bcrypt da senha "admin123"
   - O role deve ser exatamente "ADMIN" (maiúsculas)

4. Clique em **"Save 1 change"**
5. Verifique se o usuário apareceu na lista

---

## 🧪 PASSO 2: Testar Login

1. **Abra o navegador** em: http://localhost:3000/login

2. **Faça login com:**
   - Email: `admin@profissional.com`
   - Senha: `admin123`

3. **Verificar:**
   - ✅ Deve redirecionar para Home
   - ✅ Header deve mostrar "Administrador" no canto superior direito
   - ✅ Deve aparecer dropdown com "Painel Admin"

---

## 🎛️ PASSO 3: Testar Painel Admin

1. **Acessar:** http://localhost:3000/admin

2. **Verificar Dashboard:**
   - ✅ 4 cards de métricas (Clientes, Projetos, Avaliações, Contatos)
   - ✅ Todos devem mostrar "0" (banco vazio)
   - ✅ Mensagem "Bem-vindo, Administrador"

3. **Testar navegação:**
   - Clique em cada card
   - Verifique se as páginas carregam:
     - `/admin/clientes` - Lista de clientes
     - `/admin/portfolio` - Gerenciar portfólio
     - `/admin/avaliacoes` - Moderar avaliações
     - `/admin/contatos` - Visualizar contatos

---

## 🏠 PASSO 4: Testar Páginas Públicas

### 4.1 Home
- **URL:** http://localhost:3000
- **Verificar:**
  - ✅ Hero section com título
  - ✅ 2 botões (Entre em Contato, Ver Portfólio)
  - ✅ 3 cards de features
  - ✅ CTA final
  - ✅ Botão WhatsApp flutuante (canto inferior direito)

### 4.2 Portfólio
- **URL:** http://localhost:3000/portfolio
- **Verificar:**
  - ✅ Mensagem "Nenhum projeto cadastrado ainda"
  - ✅ Layout responsivo

### 4.3 Serviços
- **URL:** http://localhost:3000/servicos
- **Verificar:**
  - ✅ 4 cards de serviços
  - ✅ Ícones e descrições
  - ✅ Lista de features com checkmarks

### 4.4 Avaliações
- **URL:** http://localhost:3000/avaliacoes
- **Verificar:**
  - ✅ Mensagem "Nenhuma avaliação ainda"
  - ✅ Link para Google Reviews
  - ✅ CTA para deixar avaliação

### 4.5 Contato
- **URL:** http://localhost:3000/contato
- **Verificar:**
  - ✅ Formulário com 4 campos (nome, email, telefone, mensagem)
  - ✅ Informações de contato
  - ✅ Horário de atendimento

---

## 📝 PASSO 5: Testar Formulário de Contato

1. **Preencher formulário:**
   ```
   Nome: João Silva
   Email: joao@teste.com
   Telefone: (11) 99999-9999
   Mensagem: Teste de contato
   ```

2. **Clicar em "Enviar Mensagem"**

3. **Verificar:**
   - ✅ Deve redirecionar para WhatsApp
   - ✅ Mensagem formatada no WhatsApp
   - ✅ Voltar e verificar em `/admin/contatos` se salvou

---

## 👤 PASSO 6: Testar Cadastro de Cliente

1. **Fazer logout** (se estiver logado como admin)
   - Clicar no nome no header > Sair

2. **Acessar:** http://localhost:3000/cadastro

3. **Criar conta:**
   ```
   Nome: Maria Santos
   Email: maria@teste.com
   Telefone: (11) 98888-8888
   Senha: senha123
   ```

4. **Verificar:**
   - ✅ Deve redirecionar para /login
   - ✅ Fazer login com as credenciais
   - ✅ Deve funcionar normalmente

---

## 🔐 PASSO 7: Testar Perfil de Usuário

1. **Logado como cliente, acessar:** http://localhost:3000/perfil

2. **Verificar:**
   - ✅ Dados do usuário exibidos
   - ✅ Avatar com inicial do nome
   - ✅ Data de cadastro

3. **Editar perfil:**
   - Alterar nome para "Maria Santos Silva"
   - Salvar

4. **Verificar:**
   - ✅ Mensagem de sucesso
   - ✅ Nome atualizado no header

---

## 📱 PASSO 8: Testar Responsividade

### Desktop (> 1024px)
- ✅ Menu completo no header
- ✅ Grids com 3 colunas
- ✅ Espaçamento adequado

### Tablet (768px - 1024px)
- F12 > Toggle Device Toolbar > iPad
- ✅ Grids com 2 colunas
- ✅ Menu desktop visível

### Mobile (< 768px)
- F12 > Toggle Device Toolbar > iPhone SE
- ✅ Menu hamburger aparece
- ✅ Grids com 1 coluna
- ✅ Botões full-width

---

## ✅ Checklist Final

### Funcionalidades Básicas
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Logout funciona
- [ ] Perfil editável
- [ ] Formulário de contato salva
- [ ] WhatsApp redirect funciona

### Painel Admin
- [ ] Dashboard carrega
- [ ] Páginas admin acessíveis
- [ ] Apenas ADMIN acessa
- [ ] Métricas corretas

### Design
- [ ] Cores consistentes
- [ ] Fonte Inter carregando
- [ ] Responsivo em 3 tamanhos
- [ ] Botão WhatsApp visível
- [ ] Sem erros de console

### Performance
- [ ] Páginas carregam rápido (< 2s)
- [ ] Sem warnings no terminal
- [ ] Imagens carregam
- [ ] Transições suaves

---

## 🐛 Problemas Comuns

### "Cannot find module"
```bash
npm install
npx prisma generate
```

### Erro de login
- Verificar se admin foi criado corretamente
- Email: admin@profissional.com
- Senha: admin123
- Role: ADMIN

### Página em branco
- Verificar console do navegador (F12)
- Verificar terminal do npm run dev
- Limpar cache: Ctrl+Shift+R

### Formulário não envia
- Verificar se todos os campos estão preenchidos
- Verificar console para erros
- Verificar se DATABASE_URL está correto

---

## 📊 Relatório de Teste

Após completar todos os passos, preencha:

```
✅ Testes Passados: __/15
❌ Testes Falhados: __/15
⚠️  Problemas Encontrados: 

Observações:
- 
- 
- 

Status Geral: [ ] Aprovado  [ ] Reprovado  [ ] Precisa Ajustes
```

---

## 🎯 Próximos Passos Após Testes

1. **Se tudo funcionou:**
   - Adicionar conteúdo real (projetos, avaliações)
   - Personalizar textos e informações
   - Preparar para deploy (ver GUIA_DEPLOY.md)

2. **Se encontrou problemas:**
   - Anotar todos os erros
   - Verificar console do navegador
   - Verificar terminal do servidor
   - Consultar GUIA_TESTES.md para troubleshooting

---

**Tempo estimado de teste**: 15-20 minutos  
**Última atualização**: Janeiro 2026
