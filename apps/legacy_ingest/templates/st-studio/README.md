# Site de Estúdio de Beleza

Template moderno e responsivo para estúdios de beleza (nail design, tatuagem, cabeleireiro e similares).

## Funcionalidades

### Site Público
- ✅ Página inicial moderna e responsiva
- ✅ Portfólio com galeria de trabalhos e filtros por categoria
- ✅ Página de serviços com preços e descrições detalhadas
- ✅ Formulário de contato com captura de leads
- ✅ Botão flutuante WhatsApp para contato rápido
- ✅ Design totalmente responsivo (mobile-first)

### Painel Administrativo
- ✅ Dashboard com estatísticas e métricas
- ✅ CRM completo para gerenciamento de leads
- ✅ Gerenciamento de portfólio (adicionar, editar, categorizar)
- ✅ Gerenciamento de serviços (preços, duração, categorias)
- ✅ Controle financeiro (receitas e despesas)
- ✅ Sistema de mensagens integrado
- ✅ Autenticação segura com JWT

### Integrações
- ✅ API REST completa
- ✅ Estrutura preparada para integração WhatsApp
- ✅ Criação automática de leads via formulários
- ✅ Histórico completo de interações

## Tecnologias

### Stack Principal
- **Frontend**: Next.js 14.2.5 (App Router), React 18.3.1, TypeScript 5.5.4
- **Estilização**: Tailwind CSS 3.4.7, PostCSS, Autoprefixer
- **Backend**: Next.js API Routes, Node.js 18+
- **Banco de Dados**: MongoDB 6.5.0 com Mongoose 8.5.1
- **Autenticação**: NextAuth.js 4.24.7, JWT, bcryptjs
- **Validação**: Zod 3.23.8, React Hook Form 7.52.1
- **UI**: Lucide React 0.378.0 (ícones)
- **Utilitários**: date-fns 3.6.0

### Desenvolvimento
- **Linting**: ESLint 8.57.1, eslint-config-next 14.2.5
- **Tipos**: @types/node, @types/react, @types/react-dom

📚 Veja [STACK.md](./STACK.md) para detalhes completos da stack tecnológica.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Configure o arquivo `.env` com suas credenciais:
- `MONGODB_URI`: URL de conexão do MongoDB
- `NEXTAUTH_SECRET`: Chave secreta para autenticação
- `NEXTAUTH_URL`: URL do site (ex: http://localhost:3000)
- `WHATSAPP_API_KEY`: Chave da API do WhatsApp (opcional)

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse http://localhost:3000

## Primeiro Acesso ao Admin

1. Inicialize o admin acessando: `http://localhost:3000/api/init` (após iniciar o servidor)
2. Acesse `/admin/login` e use as credenciais padrão:
   - Email: admin@studio.com
   - Senha: admin123

**IMPORTANTE**: Altere a senha padrão após o primeiro acesso!

## Dados de Exemplo

Para popular o banco com dados de exemplo (serviços e portfólio):

```bash
node scripts/seed-data.js
```

## Documentação Completa

- 📖 [Guia de Instalação Detalhado](./INSTALL.md) - Instalação passo a passo
- 🧪 [Guia de Testes](./TESTING.md) - Checklist completo de testes
- 🚀 [Guia de Hospedagem](./HOSPEDAGEM.md) - Deploy em produção
- 📦 [Stack Tecnológica](./STACK.md) - Resumo completo da stack
- 🔄 [Atualizações](./UPDATES.md) - Histórico de atualizações
- 🛡️ [Auditoria de Segurança](./SECURITY_AUDIT.md) - Relatório de vulnerabilidades
- 📋 [Resumo da Auditoria](./AUDIT_SUMMARY.md) - Resumo executivo
- 💬 [Integração WhatsApp](./WHATSAPP_INTEGRATION.md) - Guia de integração

## Estrutura do Projeto

```
├── app/                    # App Router do Next.js
│   ├── (public)/          # Rotas públicas
│   ├── admin/             # Painel administrativo
│   └── api/               # API routes
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── models/                # Modelos do MongoDB
└── types/                 # Tipos TypeScript
```

## Licença

MIT

