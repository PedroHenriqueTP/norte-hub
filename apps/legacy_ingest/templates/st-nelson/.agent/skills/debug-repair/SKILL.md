---
name: debug-repair
description: Especialista em ler stack traces, identificar erros de build/runtime e corrigir o código fonte automaticamente.
---

# Objetivos
Identificar a causa raiz de erros de compilação (como Next.js/Turbopack) e erros de tempo de execução, e aplicar correções cirúrgicas nos arquivos afetados.

# Instruções

1. **Análise de Stack Trace**:
   - Quando o usuário fornecer um erro (texto ou imagem), procure imediatamente por caminhos de arquivo (ex: `./app/globals.css:1:1`) e tipos de erro (ex: `CssSyntaxError`, `ReferenceError`).
   - Extraia a linha e a coluna do erro, se disponível.

2. **Diagnóstico Contextual**:
   - Leia o conteúdo do arquivo identificado.
   - Analise o erro específico.
     - *Exemplo do caso atual*: Se o erro for "unknown utility class", verifique se o usuário tentou usar CSS padrão (ex: `border-box`) dentro de uma diretiva `@apply` do Tailwind, onde deveria usar a classe utilitária correta (ex: `box-border`).

3. **Protocolo de Correção**:
   - **Correção Sintática**: Para erros de digitação ou sintaxe inválida (como no Tailwind ou erros de ponto e vírgula).
   - **Correção de Dependência**: Se for um módulo faltando, sugira ou execute a instalação (`npm install`).
   - **Correção Lógica**: Se for erro de lógica, reescreva o bloco de código mantendo a intenção original.

4. **Validação**:
   - Após aplicar a correção, se houver um servidor rodando, verifique se o erro persiste no console.
   - Se for um erro de build, tente rodar o comando de build (`npm run build` ou `next build`) para validar a correção.

# Gatilhos de Ação
Sempre que detectar palavras-chave como "Erro", "Crash", "Falha no build", "Exception" ou "Bug", ative esta skill.

# Exemplo de Resolução (Baseado no seu contexto)
User: "Estou com esse erro: CssSyntaxError: tailwindcss: ... unknown utility class 'border-box' em ./app/globals.css"
Agent: 
1. Lê `app/globals.css`.
2. Identifica que `border-box` não é uma classe do Tailwind.
3. Substitui `border-box` por `box-border` (a classe correta do Tailwind) ou remove a linha se for redundante.
4. Salva o arquivo e monitora o re-build do Turbopack.
