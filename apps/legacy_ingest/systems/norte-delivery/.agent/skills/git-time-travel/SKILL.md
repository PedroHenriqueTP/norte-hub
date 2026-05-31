
# Skill: Git Time Travel (Navegação de Versões)

## Descrição
Facilita a alternância entre versões do código (checkouts), visualização de histórico e reversão de erros, protegendo o trabalho atual do usuário.

## Comandos Principais

### 1. 📜 "Ver histórico" / "Listar versões"
- **Ação:** Execute `scripts/history_menu.py`
- **O que faz:** Mostra um menu interativo com os últimos 10 commits, mostrando hash, autor e mensagem. O usuário escolhe um número e o script faz o checkout para aquela versão.

### 2. ↩️ "Voltar para a main" / "Sair do passado"
- **Ação:** `git checkout main` (ou master)
- **Segurança:** Antes de mudar, verifique se há mudanças não salvas e sugira um `git stash`.

### 3. 🚑 "Desfazer o último commit"
- **Ação:** `git reset --soft HEAD~1`
- **O que faz:** Desfaz o commit mas MANTÉM seus arquivos editados (bom para corrigir mensagens ou esquecimentos).

## Regras de Segurança
- Nunca faça `git checkout` ou `git reset --hard` se o output de `git status` mostrar arquivos modificados, a menos que o usuário force explicitamente.
