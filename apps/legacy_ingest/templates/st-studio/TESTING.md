# Guia de Testes da Interface

Este guia fornece um checklist completo para testar todas as funcionalidades do site.

## 🧪 Checklist de Testes

### 1. Site Público

#### 1.1 Página Inicial (`/`)

- [ ] **Hero Section**
  - [ ] Título principal aparece corretamente
  - [ ] Botões "Ver Serviços" e "Entre em Contato" funcionam
  - [ ] Design responsivo em mobile/tablet/desktop

- [ ] **Preview de Serviços**
  - [ ] Lista de serviços aparece (ou mensagem "Nenhum serviço")
  - [ ] Cards mostram nome, descrição, preço e duração
  - [ ] Botão "Ver Todos os Serviços" funciona

- [ ] **Preview de Portfólio**
  - [ ] Galeria de trabalhos aparece (ou mensagem "Nenhum trabalho")
  - [ ] Imagens carregam corretamente
  - [ ] Hover mostra informações
  - [ ] Botão "Ver Portfólio Completo" funciona

- [ ] **Call to Action (CTA)**
  - [ ] Seção aparece no final
  - [ ] Botão "Fale Conosco" funciona

#### 1.2 Navegação

- [ ] **Navbar**
  - [ ] Logo/título aparece
  - [ ] Links de navegação funcionam:
    - [ ] Início
    - [ ] Portfólio
    - [ ] Serviços
    - [ ] Contato
  - [ ] Menu mobile funciona (hamburger)
  - [ ] Navbar fixa no topo ao rolar

- [ ] **Footer**
  - [ ] Informações de contato aparecem
  - [ ] Links de redes sociais funcionam
  - [ ] Links rápidos funcionam
  - [ ] Copyright aparece

#### 1.3 Portfólio (`/portfolio`)

- [ ] **Filtros**
  - [ ] Botões de categoria aparecem
  - [ ] Filtro "Todos" mostra todos os itens
  - [ ] Filtros por categoria funcionam corretamente
  - [ ] Categoria selecionada fica destacada

- [ ] **Galeria**
  - [ ] Grid de imagens aparece
  - [ ] Imagens carregam corretamente
  - [ ] Hover mostra overlay com informações
  - [ ] Clique abre página de detalhes

- [ ] **Página de Detalhes** (`/portfolio/[id]`)
  - [ ] Imagem principal aparece
  - [ ] Título e descrição aparecem
  - [ ] Categoria aparece como badge
  - [ ] Data aparece
  - [ ] Galeria de fotos adicionais aparece (se houver)
  - [ ] Botão "Voltar" funciona

#### 1.4 Serviços (`/servicos`)

- [ ] **Filtros**
  - [ ] Botões de categoria funcionam
  - [ ] Filtro "Todos" mostra todos os serviços

- [ ] **Cards de Serviços**
  - [ ] Nome do serviço aparece
  - [ ] Descrição aparece
  - [ ] Preço formatado corretamente (R$)
  - [ ] Duração aparece (min/h)
  - [ ] Categoria aparece como badge
  - [ ] Ícone de check aparece

#### 1.5 Contato (`/contato`)

- [ ] **Informações de Contato**
  - [ ] Telefone aparece
  - [ ] Email aparece
  - [ ] Links de redes sociais funcionam

- [ ] **Formulário**
  - [ ] Campo Nome funciona
  - [ ] Campo Email valida formato
  - [ ] Campo Telefone funciona
  - [ ] Campo Mensagem funciona
  - [ ] Validação de campos obrigatórios funciona
  - [ ] Envio mostra mensagem de sucesso
  - [ ] Erro mostra mensagem de erro
  - [ ] Formulário limpa após envio bem-sucedido

- [ ] **Botão WhatsApp Flutuante**
  - [ ] Botão aparece no canto inferior direito
  - [ ] Clique abre WhatsApp com mensagem pré-formatada
  - [ ] Funciona em mobile e desktop

### 2. Painel Administrativo

#### 2.1 Autenticação (`/admin/login`)

- [ ] **Página de Login**
  - [ ] Formulário aparece
  - [ ] Campo Email funciona
  - [ ] Campo Senha funciona (oculto)
  - [ ] Validação de campos obrigatórios
  - [ ] Mensagem de erro para credenciais inválidas
  - [ ] Login bem-sucedido redireciona para dashboard

- [ ] **Proteção de Rotas**
  - [ ] Tentativa de acessar `/admin` sem login redireciona
  - [ ] Tentativa de acessar outras rotas admin sem login redireciona

#### 2.2 Dashboard (`/admin`)

- [ ] **Cards de Estatísticas**
  - [ ] Total de Leads aparece
  - [ ] Novos Leads aparece
  - [ ] Receita Total aparece formatada
  - [ ] Total de Mensagens aparece

- [ ] **Leads Recentes**
  - [ ] Lista de leads aparece
  - [ ] Status aparece com cores corretas
  - [ ] Informações de contato aparecem

- [ ] **Transações Recentes**
  - [ ] Lista de transações aparece
  - [ ] Receitas aparecem em verde
  - [ ] Despesas aparecem em vermelho
  - [ ] Valores formatados corretamente

#### 2.3 CRM - Leads (`/admin/leads`)

- [ ] **Lista de Leads**
  - [ ] Tabela aparece com todos os leads
  - [ ] Colunas aparecem: Nome, Contato, Origem, Status, Data, Ações
  - [ ] Status aparece com cores corretas
  - [ ] Contador total aparece

- [ ] **Edição de Lead**
  - [ ] Botão de editar abre modal
  - [ ] Campo Status funciona (dropdown)
  - [ ] Campo Notas funciona (textarea)
  - [ ] Botão Salvar atualiza lead
  - [ ] Botão Cancelar fecha modal
  - [ ] Atualização reflete na lista

#### 2.4 Portfólio Admin (`/admin/portfolio`)

- [ ] **Lista de Itens**
  - [ ] Grid de itens aparece
  - [ ] Imagens aparecem
  - [ ] Informações aparecem (título, categoria, destaque)

- [ ] **Adicionar Item**
  - [ ] Botão "Novo Item" abre formulário
  - [ ] Campo Título funciona
  - [ ] Campo Descrição funciona
  - [ ] Campo Categoria funciona (dropdown)
  - [ ] Checkbox "Destaque" funciona
  - [ ] Campo URLs de Imagens funciona (textarea)
  - [ ] Botão Salvar cria item
  - [ ] Novo item aparece na lista

#### 2.5 Serviços Admin (`/admin/servicos`)

- [ ] **Lista de Serviços**
  - [ ] Tabela aparece
  - [ ] Colunas aparecem: Nome, Categoria, Preço, Duração, Status

- [ ] **Adicionar Serviço**
  - [ ] Botão "Novo Serviço" abre formulário
  - [ ] Campo Nome funciona
  - [ ] Campo Descrição funciona
  - [ ] Campo Preço funciona (número)
  - [ ] Campo Duração funciona (número)
  - [ ] Campo Categoria funciona (dropdown)
  - [ ] Checkbox "Ativo" funciona
  - [ ] Botão Salvar cria serviço
  - [ ] Novo serviço aparece na lista

#### 2.6 Financeiro (`/admin/financeiro`)

- [ ] **Cards de Resumo**
  - [ ] Receita Total aparece
  - [ ] Despesas Total aparece
  - [ ] Saldo aparece (verde se positivo, vermelho se negativo)

- [ ] **Adicionar Transação**
  - [ ] Botão "Nova Transação" abre formulário
  - [ ] Campo Tipo funciona (Receita/Despesa)
  - [ ] Campo Valor funciona (número)
  - [ ] Campo Descrição funciona
  - [ ] Campo Categoria funciona
  - [ ] Campo Data funciona (date picker)
  - [ ] Botão Salvar cria transação
  - [ ] Resumo atualiza automaticamente

- [ ] **Lista de Transações**
  - [ ] Tabela aparece
  - [ ] Transações aparecem ordenadas por data
  - [ ] Receitas aparecem com "+" e verde
  - [ ] Despesas aparecem com "-" e vermelho

#### 2.7 Mensagens (`/admin/mensagens`)

- [ ] **Lista de Clientes**
  - [ ] Lista de leads aparece
  - [ ] Contador de mensagens aparece
  - [ ] Seleção de cliente funciona

- [ ] **Conversa**
  - [ ] Mensagens aparecem ao selecionar cliente
  - [ ] Mensagens recebidas aparecem à esquerda
  - [ ] Mensagens enviadas aparecem à direita
  - [ ] Timestamp aparece
  - [ ] Tipo de mensagem aparece (WhatsApp/Email/Site)

- [ ] **Enviar Mensagem**
  - [ ] Campo de texto aparece
  - [ ] Botão Enviar funciona
  - [ ] Mensagem aparece na conversa após envio
  - [ ] Campo limpa após envio

#### 2.8 Navegação Admin

- [ ] **Sidebar**
  - [ ] Links aparecem: Dashboard, Leads, Portfólio, Serviços, Financeiro, Mensagens
  - [ ] Link ativo fica destacado
  - [ ] Clique em link navega corretamente
  - [ ] Botão Sair funciona
  - [ ] Menu mobile funciona (hamburger)

### 3. Testes de Responsividade

#### 3.1 Mobile (< 768px)

- [ ] **Site Público**
  - [ ] Navbar colapsa em menu hamburger
  - [ ] Conteúdo se ajusta à largura
  - [ ] Imagens não quebram layout
  - [ ] Formulários são usáveis
  - [ ] Botões têm tamanho adequado para toque

- [ ] **Painel Admin**
  - [ ] Sidebar colapsa em menu
  - [ ] Tabelas são scrolláveis horizontalmente
  - [ ] Modais ocupam tela inteira
  - [ ] Formulários são usáveis

#### 3.2 Tablet (768px - 1024px)

- [ ] Layout se adapta corretamente
- [ ] Grids ajustam número de colunas
- [ ] Navegação funciona bem

#### 3.3 Desktop (> 1024px)

- [ ] Layout usa espaço disponível
- [ ] Sidebar admin sempre visível
- [ ] Grids mostram máximo de colunas

### 4. Testes de Performance

- [ ] **Carregamento Inicial**
  - [ ] Página inicial carrega em < 3 segundos
  - [ ] Imagens carregam progressivamente
  - [ ] Não há bloqueios de renderização

- [ ] **Navegação**
  - [ ] Transições entre páginas são suaves
  - [ ] Não há delays perceptíveis

- [ ] **API**
  - [ ] Requisições completam em < 1 segundo
  - [ ] Loading states aparecem quando necessário

### 5. Testes de Acessibilidade

- [ ] **Navegação por Teclado**
  - [ ] Tab navega por elementos interativos
  - [ ] Enter ativa botões/links
  - [ ] Escape fecha modais

- [ ] **Contraste**
  - [ ] Texto é legível sobre fundos
  - [ ] Botões têm contraste adequado

- [ ] **Alt Text**
  - [ ] Imagens têm textos alternativos

### 6. Testes de Integração

#### 6.1 Formulário de Contato

- [ ] **Envio de Lead**
  - [ ] Lead é criado no banco de dados
  - [ ] Mensagem é salva no histórico
  - [ ] Email de confirmação (se configurado)

#### 6.2 APIs

- [ ] **GET /api/portfolio**
  - [ ] Retorna lista de itens
  - [ ] Filtro por categoria funciona

- [ ] **GET /api/services**
  - [ ] Retorna lista de serviços
  - [ ] Filtro por categoria funciona

- [ ] **POST /api/leads**
  - [ ] Cria lead no banco
  - [ ] Validação funciona
  - [ ] Retorna erro para dados inválidos

- [ ] **POST /api/transactions**
  - [ ] Requer autenticação
  - [ ] Cria transação no banco
  - [ ] Atualiza resumo financeiro

## 📊 Relatório de Testes

Use este template para documentar seus testes:

```markdown
## Data: [DATA]
## Testador: [NOME]

### Resultados
- Total de testes: X
- Passou: Y
- Falhou: Z
- Taxa de sucesso: Y/X * 100%

### Problemas Encontrados
1. [Descrição do problema]
   - Severidade: Alta/Média/Baixa
   - Passos para reproduzir: [...]
   - Solução: [...]

### Observações
[Notas adicionais]
```

## 🐛 Problemas Comuns e Soluções

### Imagens não carregam
- Verifique URLs das imagens no banco de dados
- Verifique configuração do Next.js para domínios externos

### Formulários não enviam
- Verifique console do navegador para erros
- Verifique se API está rodando
- Verifique CORS (se aplicável)

### Login não funciona
- Verifique se admin foi criado (`/api/init`)
- Verifique cookies do navegador
- Limpe cache e cookies

### Dados não aparecem
- Verifique conexão com MongoDB
- Verifique se dados existem no banco
- Verifique console para erros de API

## ✅ Checklist Rápido

Execute este checklist rápido antes de considerar o site pronto:

- [ ] Site público carrega sem erros
- [ ] Navegação funciona em todas as páginas
- [ ] Formulário de contato envia dados
- [ ] Login admin funciona
- [ ] Dashboard mostra estatísticas
- [ ] CRUD de leads funciona
- [ ] CRUD de portfólio funciona
- [ ] CRUD de serviços funciona
- [ ] Sistema financeiro funciona
- [ ] Mensagens funcionam
- [ ] Site é responsivo
- [ ] Botão WhatsApp funciona

## 📝 Próximos Passos

Após completar os testes:

1. ✅ Documente problemas encontrados
2. ✅ Corrija bugs críticos
3. ✅ Teste novamente após correções
4. ✅ Prepare para deploy (veja HOSPEDAGEM.md)

