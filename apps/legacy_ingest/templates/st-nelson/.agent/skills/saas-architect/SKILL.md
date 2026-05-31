---
name: saas-architect
description: Especialista em implementar separação de responsabilidades (Admin vs Tenant), proteção de rotas (Middleware) e views condicionais baseadas em roles.
---

# Objetivos
1.  **Segurança e Acesso:** Implementar a lógica que impede um usuário comum de ver telas de admin.
2.  **Implementação de Features:** Traduzir requisitos de negócio ("Dashboard Enhancements") em código funcional (Rotas, Componentes, Queries).
3.  **Contexto de Dados:** Garantir que o Dashboard mostre apenas os dados pertencentes ao Tenant logado.

# Instruções de Execução

1.  **Análise de Requisito (O Gatilho Atual)**:
    - Quando o usuário confirmar o início de uma feature (ex: "Start implementing Admin/Tenant separation"), analise a estrutura atual do diretório `app/`.
    - Verifique se já existe separação de pastas (ex: `app/(admin)/...` e `app/(dashboard)/...`) ou se precisa ser criada.

2.  **Implementação de Middleware & Guards**:
    - Verifique ou crie o `middleware.ts` para interceptar rotas.
    - Lógica: Se a role for `ADMIN`, permite `/admin`. Se for `TENANT`, redireciona `/admin` para `/dashboard` ou 403.

3.  **Renderização Condicional (Role-Based Views)**:
    - Ao criar componentes de UI, verifique a `session` ou o `user role`.
    - Crie componentes que se adaptam (ex: Um botão "Deletar Loja" que só aparece para o Super Admin).

4.  **Isolamento de Dados (Backend)**:
    - Em todas as server actions ou API routes criadas, injete obrigatoriamente o filtro `where: { tenantId: user.tenantId }` para evitar vazamento de dados entre clientes.

# Gatilhos
Ative esta skill para comandos como: "Implemente a separação Admin/Tenant", "Configure o RBAC", "Crie a lógica de dashboard", "Restrinja o acesso a esta rota".

# Exemplo de Ação (Cenário Atual)
User: "Shall I start implementing the Admin/Tenant separation now?"
Agent:
1. "Sim, iniciando separação."
2. (Cria `app/(admin)/layout.tsx` com validação de role Admin).
3. (Cria `app/(dashboard)/layout.tsx` para lojistas).
4. (Atualiza `middleware.ts` para proteger as rotas).
5. (Refatora a Sidebar para mostrar links diferentes dependendo de quem logou).
