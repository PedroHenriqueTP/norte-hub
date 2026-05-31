# Roadmap do Projeto Delivery SaaS

Este documento rastreia o progresso do desenvolvimento da plataforma de delivery multi-tenant.

## 🏁 Status Atual: Fase de Desenvolvimento Avançado / Pré-Lançamento

O projeto possui uma estrutura Monorepo sólida com Next.js (Frontend) e NestJS (Backend), compartilhando tipos e esquema de banco de dados via Prisma. A maioria dos módulos principais está implementada.

### ✅ Módulos Implementados (Backend & Frontend)
- **Autenticação & Multi-tenancy**:
  - Login/Registro com suporte a tenants.
  - Middleware de contexto de tenant (com observações de melhoria).
- **Gestão de Produtos (Menu)**:
  - CRUD de Produtos e Categorias.
  - Ficha técnica (ProductRecipe) vinculada ao estoque.
- **Pedidos (Orders)**:
  - Fluxo completo de criação e atualização de pedidos.
  - WebSockets (Gateway) para atualizações em tempo real.
  - Integração inicial com Financeiro.
- **Estoque (Inventory)**:
  - Gestão de ingredientes.
  - Movimentações de estoque (Entrada/Saída/Perda).
- **Financeiro**:
  - Registro de transações por pedido.
- **Módulos de Apoio**:
  - Clientes (CRM simplificado).
  - Mesas (Gestão de salão).
  - Integrações (Estrutura pronta para iFood/etc).

## 🚀 Próximos Passos (Curto Prazo)

### 1. Refinamento e "Conclusion"
- [x] **Revisão de Multi-tenancy**: Implementada segurança reforçada no `OrdersService` (uso de `findFirst` e validação de `TenantContext`). Testes unitários (`src/modules/orders/orders.service.spec.ts`) garantem a consistência.
- [ ] **Validação de Fluxos**: Testar o fluxo completo de *Pedido -> Cozinha -> Entrega -> Financeiro* para garantir que todos os gatilhos (baixa de estoque, registro financeiro) estão funcionando em harmonia.
- [ ] **Tratamento de Erros**: Melhorar as mensagens de erro na API (Exception Filters) para serem mais amigáveis ao Frontend.

### 2. Preparação para Operação (Deploy)
- [x] **Containerização de Produção**: Criado `docker-compose.prod.yml` otimizado e `Dockerfile.prod` para API e Web (Standalone).
- [x] **CI/CD**: Configurado pipeline básico (GitHub Actions) em `.github/workflows/ci.yml`.
- [ ] **Monitoramento**: Adicionar logs estruturados e talvez uma ferramenta de APM (ex: OpenTelemetry ou simples Sentry).

### 3. Automação e Manutenção (Skills)
- [x] **DocReviewer**: Skill implementada para manter a documentação da API sincronizada com o código.
- [x] **Security Guardian**: Skill de auditoria de segurança (npm audit) com correções automatizadas.

## 🔮 Futuro (Médio/Longo Prazo)
- **Integrações Reais**: Implementar a conexão real com a API do iFood/Rappi.
- **App do Entregador**: PWA ou App nativo focado na experiência do entregador (geolocalização, rotas).
- **Marketing/Fidelidade**: Módulo avançado de campanhas e cashback.
