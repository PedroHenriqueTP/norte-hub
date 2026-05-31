---
name: DocReviewer
description: Automates documentation updates by scanning code changes, ensuring API guides and READMEs are always in sync with implementation.
---

# DocReviewer Skill

O **DocReviewer** é uma skill projetada para manter a documentação viva e sincronizada com o código. Ele analisa alterações em controllers, serviços e configurações para sugerir ou aplicar atualizações na documentação.

## 🎯 Objetivos

1.  **Sincronização de API**: Detectar novas rotas em Controllers e atualizar guias de referência.
2.  **Consistência de Metadados**: Verificar se novos arquivos possuem licença e se o `package.json` está alinhado com o `README.md`.
3.  **Qualidade de Documentação**: Garantir que links quebrados ou instruções obsoletas sejam sinalizados.

## 🛠️ Como Usar

Esta skill é executada via script Node.js.

```bash
node .agent/skills/doc_reviewer/scripts/scan_docs.js
```

## 📋 Regras de Ouro

1.  **Nunca** apague documentação existente sem verificar se a funcionalidade foi removida.
2.  **Sempre** gere um relatório do que foi alterado ou sugerido.
3.  Priorize o formato Markdown (GFM).

## 📂 Estrutura Associada

-   `scripts/scan_docs.js`: O motor de análise.
-   `templates/`: Modelos para novos arquivos de documentação (opcional).
