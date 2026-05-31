# Skill: Project Manager & Strategy

## Descrição
Esta skill é responsável pela "Visão de Águia". Ela analisa o estado atual do código, gerencia o arquivo `ROADMAP.md`, sugere features e quebra grandes objetivos em tarefas técnicas menores para os agentes de execução.

## 1. Protocolo de Auditoria (O que temos?)
Quando o usuário perguntar "Como está o projeto?" ou "Analise o status":
1. Execute `scripts/audit_project.py` para mapear a estrutura atual, dependências e schema do banco.
2. Leia o arquivo `ROADMAP.md` (se existir).
3. Compare a realidade (código) com o planejado (roadmap).
4. Gere um relatório:
   - **Concluído:** O que já está codado.
   - **Em Progresso:** O que parece incompleto.
   - **Dívida Técnica:** Códigos sem validação, tipos `any`, etc.

## 2. Protocolo de Planejamento (O que faremos?)
Quando o usuário pedir "Planeje a feature X" ou "O que falta para o MVP?":
1. Analise o contexto do negócio (Ex: Delivery, CRM).
2. Sugira funcionalidades faltantes essenciais (Ex: "Falta autenticação", "Falta gateway de pagamentos").
3. Brainstorm: Sugira features "Diferenciais" (Ex: "Gamificação", "IA para recomendação").
4. **Ação Principal:** Crie ou Atualize o arquivo `ROADMAP.md` com um checklist de tarefas.

## 3. Protocolo de Execução (Mão na Massa)
Quando o usuário disser "Execute o plano":
1. Pegue a primeira tarefa não marcada do `ROADMAP.md`.
2. Quebre essa tarefa em passos técnicos (Backend -> Frontend -> Integração).
3. Instrua o usuário a ativar as skills de execução (ex: "Agora use a skill `delivery-ops` para criar a API...").

## Estrutura do ROADMAP.md
O arquivo deve seguir este padrão:
- ## [Status: 30%] MVP Delivery
- [x] Configuração Inicial (Docker/Git)
- [ ] [ALTA] Autenticação (NextAuth/Clerk)
- [ ] [MÉDIA] Cadastro de Restaurantes
