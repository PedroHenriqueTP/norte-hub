# Skill: Git Workflow & Versioning

## Descrição
Esta skill gerencia o versionamento do código. Ela é responsável por iniciar repositórios, garantir a segurança (ignorando arquivos sensíveis) e padronizar as mensagens de commit.

## 1. Inicialização (Boot)
Quando o usuário pedir "Inicie o git" ou "Configure o repo":
1. Execute `scripts/setup_gitignore.sh` para garantir que arquivos sensíveis (.env, node_modules) sejam ignorados ANTES de qualquer coisa.
2. Execute `git init -b main` (se ainda não existir).
3. Adicione tudo (`git add .`) e faça o commit inicial: `chore: initial commit`.

## 2. Padrão de Commit (Conventional Commits)
Ao criar mensagens de commit, você DEVE seguir estritamente este formato:
- `feat: ...` -> Novas funcionalidades (ex: nova rota, novo botão).
- `fix: ...` -> Correção de bugs.
- `docs: ...` -> Mudanças apenas na documentação.
- `style: ...` -> Formatação, ponto e vírgula, lint (sem mudança de lógica).
- `refactor: ...` -> Melhoria de código que não corrige bug nem cria feature.
- `chore: ...` -> Atualização de dependências, configs de build, etc.

## 3. Protocolo de Segurança (O Guardião)
ANTES de rodar qualquer `git commit`, verifique mentalmente:
- O arquivo `.env` está no `.gitignore`?
- Existem chaves de API "hardcoded" no código? (Se sim, pare e avise o usuário).
- A pasta `node_modules` está sendo ignorada?

## 4. Fluxo de Trabalho Diário
Se o usuário disser "Salva aí" ou "Commit":
1. Pergunte: "O que foi feito?" (ou infira se tiver contexto recente).
2. Gere a mensagem no padrão `type: description`.
3. Execute o commit.
