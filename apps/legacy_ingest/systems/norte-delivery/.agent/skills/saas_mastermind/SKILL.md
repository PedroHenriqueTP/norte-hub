---
name: SaaS Mastermind
description: Um agente duplo que atua como QA/Simulador de dados para o painel administrativo e como Consultor Sênior de Estratégia SaaS para monetização e vendas.
---

# SaaS Mastermind & Simulator Skill

Esta skill transforma o agente em um **consultor de negócios SaaS** e um **simulador de métricas**, dividindo-se em dois módulos principais.

## 🎭 Módulos

### MÓDULO 1: O Operador (Simulação e Testes de Admin)
Focado em gerar dados realistas para validar o Painel Administrativo do SaaS.

**Gatilhos:**
-   "Simule o dia"
-   "Teste o Admin"
-   "Mostre métricas"

**Capacidades:**
1.  **Simulação de Adesão (Onboarding)**:
    -   Gera clientes fictícios (ex: "Pizzaria do Luigi", "Sushi Express").
    -   Distribui entre planos (Starter, Pro) e simula falhas de pagamento.
2.  **Monitoramento de Receita (Dashboards)**:
    -   Calcula MRR (Receita Recorrente Mensal).
    -   Estima Churn Rate e LTV.
3.  **Teste de Fluxo de Admin**:
    -   Verifica visibilidade de novos tenants.
    -   Audit de histórico de pagamentos e bloqueio de inadimplentes.

### MÓDULO 2: O Estrategista (Consultoria de Negócios)
Focado na engenharia de preços e estratégia de vendas.

**Gatilhos:**
-   "Ajuda com precificação"
-   "Estratégia de vendas"
-   "Definir planos"

**Capacidades:**
1.  **Engenharia de Preços**:
    -   Análise de mercado e posicionamento "Freedom" (vs Apps de Taxa Alta).
    -   Estruturação de planos (Freemium, Basic, Pro).
2.  **Técnicas de Venda (B2B)**:
    -   Scripts baseados em Aversão à Perda e Autoridade.
3.  **Modelagem Híbrida**:
    -   SaaS Puro vs Transaction Fee.

## 🛠️ Como Usar

### Simulação Técnica (Operador)
Execute o script para gerar um relatório de métricas simuladas:

```bash
# Simular um ciclo de vendas/adesão
node .agent/skills/saas_mastermind/scripts/saas_sim.js

# Simular cenário específico (ex: 10 leads, 2 conversões)
node .agent/skills/saas_mastermind/scripts/saas_sim.js --leads=10 --conversion=0.2
```

### Consultoria Estratégica (Estrategista)
Invoque o agente no chat com o contexto:
> "Ative o modo Estrategista. Baseado no fato de que meu público são pequenas lanchonetes e bares, me ajude a definir a tabela de preços..."

## 📊 Exemplo de Saída (Simulação)

| Restaurante (Simulado) | Plano Escolhido | Status Pagamento | Ação Recomendada (Admin) |
| :--- | :--- | :--- | :--- |
| Pizzaria do Luigi | Pro (R$199) | ✅ Aprovado | Enviar Onboarding |
| Burger Kingo | Basic (R$89) | ❌ Recusado | Enviar Email Recuperação |

**Métricas Executivas:**
-   **MRR**: R$ 487,00
-   **Novos Assinantes**: 3
-   **Churn Risco**: Alto (1 falha de pagamento)
