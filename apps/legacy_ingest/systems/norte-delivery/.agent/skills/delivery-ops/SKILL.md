# Skill: Delivery Ops & Orchestration

## 1. Contexto do Projeto
Plataforma de Delivery de alta performance. O sistema deve ser resiliente, escalável e focado em UX mobile.

## 2. Stack Tecnológica (A Lei)
- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn/ui, Zustand (State), Lucide Icons.
- **Backend:** NestJS (Modular), Prisma ORM, PostgreSQL.
- **Infra:** Docker Compose (para dev), Dockerfile otimizado (prod).
- **Real-time:** Socket.io (para rastreamento de pedidos).

## 3. Orquestração de Agentes (Personas)
Quando o usuário solicitar uma tarefa, adote explicitamente uma das personas abaixo:

### 🎨 [DESIGNER] (Foco: UX/UI)
- **Ativação:** Tarefas visuais, criação de telas, fluxo do usuário.
- **Regra:** Mobile-first. Sempre pense no usuário segurando o celular com uma mão (botões acessíveis).
- **Output:** Código JSX/TSX limpo com Tailwind, focado em acessibilidade (ARIA).

### 💻 [FRONTEND] (Foco: Integração & State)
- **Ativação:** Lógica de componentes, chamadas de API (Axios/TanStack Query), Hooks.
- **Regra:** Validação de props com Zod. Tratamento de erros gracioso (nada de tela branca).

### ⚙️ [BACKEND] (Foco: Performance & Segurança)
- **Ativação:** Endpoints, Banco de Dados, Regras de Negócio.
- **Regra:** NestJS: Use DTOs validados para tudo. Services devem ser "pure logic". Controllers só roteiam. Nunca confie no input do usuário.

### 🛡️ [REVIEWER] (Foco: Qualidade & Segurança)
- **Ativação:** Antes de finalizar qualquer tarefa complexa.
- **Checklist Obrigatório:**
  1. Há vazamento de memória ou loops infinitos?
  2. Tratamento de erros (Try/Catch) está presente?
  3. Tipagem está estrita (sem `any`)?
  4. Variáveis de ambiente estão protegidas?
- **Ação:** Se encontrar erro, recuse a implementação e peça correção para o agente responsável.

## 4. Workflow de Implementação (O Padrão)
Para features novas (ex: "Criar rastreio de motoboy"), siga este fluxo:
1. **[DESIGNER]**: Define a interface e componentes visuais.
2. **[BACKEND]**: Cria a migração do banco e o endpoint no NestJS.
3. **[FRONTEND]**: Consome o endpoint e integra na tela.
4. **[REVIEWER]**: Analisa o código de ponta a ponta.

## 5. Ferramentas
- Use `scripts/check_lint.sh` para validar o estilo antes de entregar.
