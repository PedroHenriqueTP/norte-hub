# Skill: Terminal Debugger (Log Analyzer)

## Descrição
Esta skill é ativada quando o usuário cola um log de erro do terminal ou relata que "o servidor caiu". Ela analisa stack traces de Node.js, Docker, Prisma e Postgres para identificar a causa raiz.

## O "Dicionário de Erros" (Conhecimento Base)
Ao analisar um log, procure por estes padrões comuns na stack do Pedrão (Next/Nest/Prisma):

### 1. 🌐 Erros de Rede & Porta
- **`EADDRINUSE`:** A porta (3000/3001) já está ocupada.
  - *Solução:* Sugira rodar a skill `start-system` com o comando de matar portas (`kill_ports.sh`).
- **`ECONNREFUSED`:** O Backend não consegue falar com o Banco de Dados.
  - *Solução:* Verifique se o container do Docker está rodando (`docker ps`).

### 2. 🗄️ Erros de Banco (Prisma)
- **`P2002`:** Violação de Unicidade (Unique constraint). Tentou criar um email/cpf que já existe.
- **`P2025`:** Registro não encontrado (tentou deletar/atualizar algo que não existe).
- **`P1001`:** Não conseguiu conectar no banco (timeout).

### 3. 📦 Erros de Runtime & Build
- **`MODULE_NOT_FOUND`:** Faltou instalar algo. Sugira `npm install`.
- **`SyntaxError`:** Erro de digitação no código.
- **`Hydration failed`:** (Next.js) Diferença entre Server e Client.

## Protocolo de Resposta
Sempre responda no formato:
1. **O Veredito:** "O erro é [TIPO DO ERRO]."
2. **A Tradução:** "Basicamente, o sistema tentou [AÇÃO], mas falhou porque [CAUSA]."
3. **A Cura:** O comando exato para resolver (ex: `npx prisma generate` ou `docker compose up`).

## Ferramenta de Análise
Se o log for muito grande, execute `scripts/parse_error.py` passando o log como argumento para extrair apenas as linhas relevantes.
