# Skill: System Boot & Process Management

## Descrição
Esta skill gerencia o ciclo de vida da aplicação (Start, Stop, Restart). Ela orquestra o Frontend (Next.js), Backend (NestJS) e Infraestrutura (Docker/Postgres).

## Comandos Suportados
O agente deve mapear as intenções do usuário para os scripts abaixo:

### 1. 🚀 "Rodar o projeto" / "Start All"
- **Ação:** Executa `scripts/boot.sh --all`
- **O que faz:** Sobe o Docker, espera o banco ficar saudável, inicia o Backend e depois o Frontend.

### 2. 🗄️ "Rodar só o banco" / "Infra"
- **Ação:** Executa `scripts/boot.sh --infra`
- **O que faz:** Apenas sobe o Docker Compose (Postgres/Redis).

### 3. 🧹 "Matar tudo" / "Limpar portas"
- **Ação:** Executa `scripts/kill_ports.sh`
- **O que faz:** Mata processos travados nas portas 3000, 3001 e 5432. Essencial quando o terminal trava mas o processo continua rodando no fundo.

## Protocolo de Erro
Se o script falhar dizendo "Port in use", sugira automaticamente executar a ação de "Matar tudo".
