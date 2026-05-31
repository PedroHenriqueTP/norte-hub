---
name: Security Guardian
description: Automatizar a auditoria de segurança (npm audit), aplicar correções de vulnerabilidades e prevenir regressões periodicamente.
---

# Security Guardian Skill

Esta skill atua como um engenheiro de DevOps focado em segurança, gerenciando vulnerabilidades de dependências NPM de forma autônoma e segura.

## 🎯 Objetivos

1.  **Auditoria Contínua**: Identificar vulnerabilidades em dependências.
2.  **Correção Segura**: Aplicar correções automáticas (`npm audit fix`) sem quebrar a aplicação.
3.  **Prevenção de Regressão**: Validar todas as alterações com Build e Testes antes de commitar.

## 🛠️ Como Usar

Execute o script de auditoria na raiz do projeto ou no workspace desejado (ex: `apps/api`):

```bash
node .agent/skills/security_guardian/scripts/security_audit.js
```

## 📋 Protocolo de Execução

1.  **Análise**: Verifica vulnerabilidades existentes.
2.  **Isolamento**: Cria uma branch temporária `security/audit-fix-[timestamp]`.
3.  **Correção Nível 1**: Tenta `npm audit fix`.
    *   *Verificação*: Roda `npm run build`. Se falhar, reverte.
4.  **Correção Nível 2** (apenas se crítico): Tenta `npm audit fix --force`.
    *   *Verificação*: Roda `npm run build` E `npm run test`. Se falhar, reverte para Nível 1.
5.  **Finalização**: Commit das alterações bem-sucedidas e relatório.

## 🕒 Periodicidade Recomendada

Rodar semanalmente (ex: Segunda-feira às 08:00 AM).
