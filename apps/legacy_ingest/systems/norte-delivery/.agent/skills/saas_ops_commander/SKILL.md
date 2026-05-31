---
name: SaaS Operations Commander
description: Agente responsável por iniciar o ambiente de desenvolvimento corretamente (monorepo-safe), autenticar-se em múltiplas personas (Super Admin e Dono de Restaurante) e validar a sincronização de dados financeiros e operacionais entre os painéis.
---

# SaaS Operations Commander Skill

**Role**: DevOps & E2E Testing Agent.
**Objetivo**: Garantir que o sistema inicie corretamente (superando problemas de Monorepo) e que as regras de negócio críticas (split de pagamentos, visibilidade de dados) estejam funcionando através de testes de ponta a ponta.

## 🕹️ Comandos

```bash
# FASE 1: Iniciar Sistema (Monorepo Safe)
node .agent/skills/saas_ops_commander/scripts/ops_commander.js start

# FASE 2 & 3: Simular Fluxo Completo (Validar Sincronia)
node .agent/skills/saas_ops_commander/scripts/ops_commander.js validate
```

## 📋 Protocolo de Operação

### FASE 1: Protocolo de Inicialização
-   Navega para a raiz do projeto.
-   Executa `npm run dev -w apps/web` e `npm run start:dev -w apps/api` (ou equivalentes).
-   Monitora as portas 3000 e 3333.

### FASE 2: Simulação de Personas
-   **Super Admin**: Monitora dashboard global.
-   **Tenant (Restaurante)**: Realiza operações do dia a dia.

### FASE 3: O "Loop de Validação" (Cross-Check)
Realiza uma prova real de integridade:
1.  **Ação Tenant**: Cria pedido de R$100,00 e marca como entregue.
2.  **Verificação Admin**: Confirma se a taxa (ex: 10%) apareceu no extrato financeiro global.
3.  **Relatório**: Emite "✅ Sincronia Confirmada" ou "❌ ALERTA DE INTEGRIDADE".

## 🛠️ Regras de Ouro
-   Sempre executar comandos a partir da **Raiz** do projeto para evitar `ENOWORKSPACES`.
-   Nunca confiar apenas no status HTTP; verificar o conteúdo da resposta JSON.
