# 🧪 Guia de Testes

## 📋 Checklist de Testes

### ✅ Testes Funcionais

#### 1. Navegação e Layout
- [ ] Header aparece em todas as páginas
- [ ] Footer aparece em todas as páginas
- [ ] Botão WhatsApp flutuante visível
- [ ] Menu mobile funciona (responsivo)
- [ ] Todos os links do menu funcionam
- [ ] Logo redireciona para Home

#### 2. Página Home
- [ ] Hero section carrega corretamente
- [ ] CTAs "Entre em Contato" e "Ver Portfólio" funcionam
- [ ] Features section exibe 3 cards
- [ ] CTA final redireciona para contato
- [ ] Responsivo em mobile/tablet/desktop

#### 3. Página Portfólio
- [ ] Grid de projetos carrega
- [ ] Projetos ordenados corretamente (featured → order → date)
- [ ] Badge "Destaque" aparece em projetos featured
- [ ] Hover effects funcionam
- [ ] Mensagem "Nenhum projeto" quando vazio
- [ ] Responsivo (1/2/3 colunas)

#### 4. Página Serviços
- [ ] 4 cards de serviços exibidos
- [ ] Ícones aparecem corretamente
- [ ] Lista de features com checkmarks
- [ ] CTA "Solicitar Orçamento" funciona
- [ ] Responsivo (grid 2x2)

#### 5. Página Avaliações
- [ ] Avaliações aprovadas exibidas
- [ ] Sistema de estrelas funciona (1-5)
- [ ] Rating médio calculado corretamente
- [ ] Avatar com inicial do nome
- [ ] Data formatada em pt-BR
- [ ] Link para Google Reviews funciona
- [ ] Mensagem quando não há avaliações

#### 6. Página Contato
- [ ] Formulário renderiza todos os campos
- [ ] Validação funciona (campos obrigatórios)
- [ ] Mensagens de erro aparecem
- [ ] Envio salva no banco de dados
- [ ] Redirect para WhatsApp após envio
- [ ] Informações de contato corretas
- [ ] Horário de atendimento exibido

#### 7. Login
- [ ] Formulário de login renderiza
- [ ] Validação de email funciona
- [ ] Validação de senha (mín 6 chars)
- [ ] Botão show/hide password funciona
- [ ] Login com credenciais corretas funciona
- [ ] Erro com credenciais inválidas
- [ ] Loading spinner aparece
- [ ] Redirect após login bem-sucedido
- [ ] Link "Cadastre-se" funciona

#### 8. Cadastro
- [ ] Formulário completo renderiza
- [ ] Validação de todos os campos
- [ ] Telefone é opcional
- [ ] Botão show/hide password funciona
- [ ] Email duplicado mostra erro
- [ ] Senha é hasheada (bcrypt)
- [ ] Usuário criado no banco
- [ ] Redirect para login após sucesso
- [ ] Link "Faça login" funciona

#### 9. Perfil
- [ ] Página protegida (requer login)
- [ ] Dados do usuário exibidos
- [ ] Avatar com inicial
- [ ] Data de cadastro formatada
- [ ] Formulário de edição funciona
- [ ] Email é read-only
- [ ] Atualização salva no banco
- [ ] Mensagem de sucesso aparece

#### 10. Painel Admin - Dashboard
- [ ] Página protegida (requer role ADMIN)
- [ ] 4 cards de métricas exibidos
- [ ] Contadores corretos (clientes, projetos, etc)
- [ ] Links para subpáginas funcionam
- [ ] Alertas de pendências aparecem
- [ ] Contatos recentes listados
- [ ] Status dos contatos (novo/contatado/convertido)

#### 11. Admin - Contatos
- [ ] Lista todos os formulários
- [ ] Ordenação por data (mais recente primeiro)
- [ ] Status badge com cores corretas
- [ ] Informações completas exibidas
- [ ] Mensagem quando vazio

#### 12. Admin - Clientes
- [ ] Tabela de clientes renderiza
- [ ] Apenas role CLIENT listado
- [ ] Dados completos (nome, email, telefone, data)
- [ ] Ordenação por data de cadastro
- [ ] Hover effect na linha
- [ ] Mensagem quando vazio

#### 13. Admin - Portfólio
- [ ] Grid de projetos exibido
- [ ] Estrela em projetos featured
- [ ] Botões Editar e Excluir aparecem
- [ ] Link "Novo Projeto" funciona
- [ ] Mensagem quando vazio

#### 14. Admin - Avaliações
- [ ] Seção "Pendentes" separada
- [ ] Seção "Aprovadas" separada
- [ ] Contadores corretos
- [ ] Botões Aprovar/Rejeitar funcionam
- [ ] Sistema de estrelas renderiza
- [ ] Botão remover em aprovadas

---

### 🔐 Testes de Segurança

#### Autenticação
- [ ] Rotas `/admin/*` protegidas
- [ ] Rota `/perfil` protegida
- [ ] Redirect para login quando não autenticado
- [ ] Apenas ADMIN acessa painel admin
- [ ] Sessão persiste após refresh
- [ ] Logout funciona corretamente

#### Validação
- [ ] Inputs validados no client-side
- [ ] Inputs validados no server-side
- [ ] SQL injection prevenido (Prisma)
- [ ] XSS prevenido (React escaping)
- [ ] CSRF tokens (NextAuth)

#### Senhas
- [ ] Senhas hasheadas com bcrypt
- [ ] Senhas nunca retornadas em APIs
- [ ] Mínimo 6 caracteres enforçado
- [ ] Hash diferente a cada criação

---

### 📱 Testes Responsivos

#### Mobile (< 768px)
- [ ] Menu hamburger funciona
- [ ] Grids viram 1 coluna
- [ ] Botões full-width
- [ ] Texto legível
- [ ] Imagens redimensionam
- [ ] Forms usáveis

#### Tablet (768px - 1024px)
- [ ] Grids 2 colunas
- [ ] Menu desktop aparece
- [ ] Layout balanceado
- [ ] Espaçamento adequado

#### Desktop (> 1024px)
- [ ] Grids 3 colunas
- [ ] Container max-width 1200px
- [ ] Espaçamento generoso
- [ ] Hover effects visíveis

---

### 🎨 Testes Visuais

#### Design System
- [ ] Cores consistentes (primary, accent, etc)
- [ ] Tipografia Inter carregando
- [ ] Pesos de fonte corretos (400, 500, 600, 700)
- [ ] Espaçamentos consistentes
- [ ] Bordas arredondadas (rounded-lg, rounded-xl)
- [ ] Sombras aplicadas corretamente

#### Animações
- [ ] Hover effects suaves
- [ ] Transições (transition-all, transition-colors)
- [ ] Loading spinners animados
- [ ] Focus states visíveis

#### Acessibilidade
- [ ] Contraste adequado (WCAG AA)
- [ ] Labels em todos os inputs
- [ ] ARIA labels onde necessário
- [ ] Navegação por teclado funciona
- [ ] Focus visível

---

### 🗄️ Testes de Banco de Dados

#### Operações CRUD
- [ ] Create: Novos registros salvos
- [ ] Read: Dados lidos corretamente
- [ ] Update: Atualizações persistem
- [ ] Delete: Exclusões funcionam

#### Integridade
- [ ] Relações entre tabelas funcionam
- [ ] Campos obrigatórios enforçados
- [ ] Valores padrão aplicados
- [ ] Timestamps (createdAt, updatedAt) automáticos

#### Performance
- [ ] Queries otimizadas (select específico)
- [ ] Índices em campos de busca
- [ ] Paginação onde necessário

---

### 🔌 Testes de API

#### Endpoints Públicos
```bash
# Contato
POST /api/contact
Body: { name, email, phone, message }
Expect: 200, { success: true }

# Registro
POST /api/auth/register
Body: { name, email, password, phone? }
Expect: 201, { success: true }
```

#### Endpoints Protegidos
```bash
# Perfil (requer auth)
PATCH /api/user/profile
Headers: Cookie com session
Body: { name, phone }
Expect: 200, { success: true }

# Admin - Aprovar Review (requer ADMIN)
PATCH /api/admin/reviews/[id]
Headers: Cookie com session ADMIN
Body: { approved: true }
Expect: 200, { success: true }
```

---

### ⚡ Testes de Performance

#### Lighthouse Scores (Alvo)
- [ ] Performance: > 90
- [ ] Accessibility: > 95
- [ ] Best Practices: > 95
- [ ] SEO: > 90

#### Métricas
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

---

## 🧪 Como Testar

### 1. Testes Manuais

```bash
# Iniciar aplicação
npm run dev

# Abrir navegador
http://localhost:3000

# Seguir checklist acima
```

### 2. Testes com Diferentes Usuários

```bash
# Criar usuário teste
# Via Prisma Studio ou formulário de cadastro

# Testar como:
- Visitante (não logado)
- Cliente (role CLIENT)
- Admin (role ADMIN)
```

### 3. Testes Responsivos

```bash
# Chrome DevTools
F12 > Toggle Device Toolbar (Ctrl+Shift+M)

# Testar em:
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)
```

### 4. Testes de Performance

```bash
# Lighthouse
F12 > Lighthouse > Generate Report

# Ou via CLI
npm install -g lighthouse
lighthouse http://localhost:3000
```

---

## 📊 Relatório de Testes

### Template

```markdown
## Teste: [Nome do Teste]
**Data**: [Data]
**Testador**: [Nome]
**Ambiente**: [Dev/Prod]

### Resultados
- ✅ Passou: [X] testes
- ❌ Falhou: [Y] testes
- ⚠️ Avisos: [Z] itens

### Problemas Encontrados
1. [Descrição do problema]
   - Severidade: [Alta/Média/Baixa]
   - Steps to reproduce: [...]
   - Expected: [...]
   - Actual: [...]

### Screenshots
[Anexar se necessário]

### Próximos Passos
- [ ] Corrigir problema 1
- [ ] Reteste após correção
```

---

## 🎯 Critérios de Aceitação

### Mínimo para Produção
- ✅ Todos os testes funcionais passando
- ✅ Sem erros de console
- ✅ Responsivo em 3 breakpoints
- ✅ Lighthouse Performance > 80
- ✅ Lighthouse Accessibility > 90
- ✅ Autenticação funcionando
- ✅ Banco de dados persistindo

### Recomendado
- ✅ Lighthouse Performance > 90
- ✅ Testes de segurança passando
- ✅ Sem warnings no build
- ✅ SEO otimizado
- ✅ Imagens otimizadas

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0
