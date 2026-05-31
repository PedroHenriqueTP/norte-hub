# Skill: Code Translator & Editor (NLP)

## Descrição
Esta skill é o "Cérebro" antes das "Mãos". Ela interpreta a linguagem natural do usuário, entende o contexto (Next.js + NestJS) e decide onde e como editar o código.

## 1. Protocolo de Interpretação (O "Parser")
Ao receber um prompt de codificação (ex: "Mude a cor do botão" ou "Crie a rota de login"), você DEVE seguir este fluxo mental antes de gerar código:

### Passo A: Análise de Domínio
Classifique o pedido em uma das categorias:
- **[UI_ONLY]:** Apenas mudanças visuais (CSS/Tailwind, Texto, Layout). Não toca em lógica ou banco.
- **[LOGIC_ONLY]:** Regras de negócio, funções utilitárias, algoritmos.
- **[DATA_FLOW]:** Envolve Backend (API), Banco de Dados e Frontend (Fetch/State).
- **[REFACTOR]:** Melhoria de código sem mudar comportamento.

### Passo B: Mapeamento de Arquivos (File Discovery)
Baseado nas palavras-chave, identifique os arquivos prováveis.
- Se ouviu "Rota" ou "Endpoint" -> Procure em `src/modules` (NestJS) ou `app/api` (Next).
- Se ouviu "Tela", "Página" ou "Botão" -> Procure em `app/` ou `components/`.
- Se ouviu "Salvar" ou "Dados" -> Verifique `schema.prisma`.

## 2. Modos de Edição (As "Mãos")

### Modo Frontend (Next.js + Tailwind)
- Se o pedido for "Mude o estilo", **NUNCA** crie um arquivo CSS separado. Use classes utilitárias do Tailwind direto no JSX.
- Se o pedido for "Adicione funcionalidade", verifique se o componente é `use client` ou `server component`.

### Modo Backend (NestJS + Prisma)
- Se o pedido for "Crie um CRUD", você deve criar/alterar em ordem:
  1. `schema.prisma` (Modelagem)
  2. `dto/` (Validação de entrada)
  3. `service.ts` (Lógica)
  4. `controller.ts` (Rotas)

## 3. Workflow de Execução
Para qualquer alteração, o agente deve:
1. **Resumo:** "Entendi. Você quer [AÇÃO] no contexto de [FRONT/BACK]."
2. **Plano:** "Vou editar os arquivos: X, Y, Z."
3. **Execução:** Mostrar o diff do código.

## Gatilho de Ambiguidade
Se o usuário disser algo vago como "Arrume o header", PERGUNTE:
- "Você se refere ao Header do site (Menu) ou aos Headers da requisição HTTP?"
