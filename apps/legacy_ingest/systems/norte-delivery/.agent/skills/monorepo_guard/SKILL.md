---
name: Monorepo Workspace Guard
description: Detect and automatically correct npm execution errors in monorepo structures (ENOWORKSPACES), preventing breakage and ensuring correct dependency management.
---

# Monorepo Workspace Guard Skill

Objetivo: Detectar e corrigir automaticamente erros de execução de scripts npm em estruturas de monorepo (como `apps/web` ou `packages/ui`), especificamente prevenindo o erro `ENOWORKSPACES`.

## 🤖 Comportamento da Skill

### 1. Reconhecimento de Contexto
Sempre que um comando `npm run` (como `dev`, `build`, `start`) falhar dentro de um subdiretório (ex: `apps/web`), a Skill deve verificar se a raiz do projeto contém um `package.json` com a chave `"workspaces"`.

> **Regra de Ouro**: Em um monorepo, NUNCA rode `npm install` dentro de uma subpasta se isso não for explicitamente suportado. Isso quebra o `package-lock.json` global.

### 2. Detecção de Erro
Gatilhos para ativação:
-   `npm error code ENOWORKSPACES`
-   `This command does not support workspaces`

### 3. Lógica de Solução Automática

#### Ação 1: Redirecionamento (NPM Workspace)
Em vez de mudar de diretório, execute o comando a partir da raiz usando a flag `-w`.

*   **De**: `cd apps/web` -> `npm run dev`
*   **Para**: `npm run dev -w apps/web` (executado na raiz)

#### Ação 2: TurboRepo (Prioritário)
Se houver um arquivo `turbo.json` na raiz, priorize o uso do Turbo:

*   **Comando**: `npx turbo run dev --filter=delivery-platform-web` (ou nome do pacote)

#### Protocolo de Recuperação (Deep Clean)
Se o erro persistir, pode haver conflito de `node_modules`.

**Comando de Limpeza (Windows/PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules; Remove-Item -Recurse -Force apps\*\node_modules; npm install
```

## 🧠 Exemplo de Intervenção

**Usuário**: Tenta rodar `npm run dev` em `apps/web` e falha.
**Antigravity**: "Detectei que você está em um workspace aninhado. O npm bloqueou a execução local. Tente este comando a partir da raiz para sincronizar as dependências corretamente:
`npm run dev -w apps/web`
Ou via Turbo:
`npx turbo dev --filter=web`"
