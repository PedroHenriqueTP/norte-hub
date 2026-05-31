---
name: Delivery Ecosystem Simulator
description: Simulate a living production environment for a multi-tenant delivery platform, generating realistic transactions and allowing real-time monitoring.
---

# Delivery Ecosystem Simulator & Payment Stress Tester Skill

Role: QA Automation Engineer & Financial Analyst Agent
Objetivo: Simular operações de negócio ponta a ponta, com foco crítico na resiliência do fluxo de checkout, processamento de pagamentos assíncronos e validação financeira.

## 🎯 Funcionalidades

1.  **Simulação de Tráfego**: Gera pedidos, pagamentos, cancelamentos e despesas operacionais.
2.  **Mock Payment Gateway**: Atua como um provedor de pagamentos (Stripe/Pagar.me), com cenários de sucesso, recusa, fraude e timeout.
3.  **Simulação de Webhooks**: Garante que o sistema lide corretamente com confirmações de pagamento assíncronas (Pix/Boleto).
4.  **Stress Testing**: Testa condições de corrida e integridade de saldo.
5.  **Multi-tenancy Real**: Opera com múltiplos restaurantes simultaneamente.
6.  **Visualização em Tempo Real**: Dashboard detalhado com funil de conversão e status financeiro.

## 🛠️ Como Usar

Execute o script de simulação:

```bash
# Iniciar simulação padrão
node .agent/skills/business_simulator/scripts/simulator.js start

# Iniciar com velocidade alta (teste de carga)
node .agent/skills/business_simulator/scripts/simulator.js start chaos

# Executar Stress Test de Pagamentos (Concorrência)
# Tenta N checkouts simultâneos no mesmo tenant
node .agent/skills/business_simulator/scripts/simulator.js stress 10

# Apenas executar a folha de pagamento
node .agent/skills/business_simulator/scripts/simulator.js payroll
```

## 📋 Módulos de Simulação

### 1. Mock Gateway (O Banco)
Intercepta checkouts e decide o resultado via RNG:
-   ✅ **Sucesso (70%)**: Aprovado.
-   ❌ **Recusa (15%)**: Saldo Insuficiente.
-   ⚠️ **Antifraude (10%)**: "Review Pending" (simula delay/webhook).
-   🔌 **Erro (5%)**: Timeout simulado.

### 2. Webhooks (O Retorno)
Para pagamentos pendentes (Pix/Antifraude), a skill dispara um POST para `/webhooks/payments/notify` após 2-10s.

### 3. Checkouts & UX
-   **Cartão**: Gera números de teste válidos (Luhn).
-   **Pix**: Simula fluxo assíncrono.
-   **Split**: Verifica se a taxa da plataforma foi descontada corretamente.

### 4. Auditoria
Verifica se `Saldo Anterior + (Vendas - Taxas) == Saldo Atual` a cada ciclo.
