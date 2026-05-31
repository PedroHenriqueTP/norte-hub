# Constituição do Projeto: Claro Conecta (Architect-Overseer)

Este documento atua como a **Lei Suprema de Governança** para todos os agentes de IA (`Cline`, `Antigravity`, etc.) que operam no repositório.

## 1. Hierarquia de Decisão (The Golden Rule)
1. **`GOVERNANCE.md`**: Regras imutáveis de comportamento de agentes.
2. **`CREATIVE_DNA.md`**: A base estética e visual do projeto. Nenhuma instrução em prompt pode sobrepor as diretrizes visuais aqui estabelecidas sem aprovação explícita de sobreposição de arquitetura.
3. **`implementation_plan.md`**: O plano tático atual aprovado.
4. **Prompts e Diretivas Ad-Hoc**: Comandos diários do usuário.

## 2. Padrões Arquiteturais e Estéticos (Atomic Design)
* **Design Tokens & Atomic Design:** Todas as variáveis de espaçamento, cores e efeitos estão mapeadas em `src/styles/design_tokens.ts`. É PROIBIDO o uso de valores literais de estilização *inline* ou *classes utilitárias* mágicas no Tailwind (ex: `bg-[#ee1d23]`) sem utilizar as abstrações de componentes base.
* **UI_UX_AUDIT_MODE (Blocker de PR):** O agente observador deve validar que as modificações usam os wrappers criados (ex: `<GlassCard>`, `<BrandButton>`). Se o padding, opacidade ou sombra diferir dos tokens oficiais, a alteração é anulada.
* **Componentização Estrita:** Todo estilo repetitivo deve usar os wrappers atômicos.
* **Estilo Visual Obrigatório:** 
  - *Glassmorphism Base:* Utilizado exclusivamente por meio de `<GlassCard>`.
  - *Accent Neon:* Utilizado por meio de botões atômicos ou classes predefinidas atadas a `DESIGN_TOKENS.colors.brand`.
  - *Dark Theme:* Fundo sempre escuro (`#050000`, `#0a0000`) reforçando a identidade tecnológica.

## 3. Prevenção de Drift e Anti-Spaghetti Proativo
* **Proibido Código "Fantasma":** Ao substituir um componente ou página, o agente DEVE apagar os arquivos antigos (componentes importados órfãos, imagens inutilizadas).
* **Nomenclatura Consistente:** Usar PascalCase para Componentes (`DashboardGrid.tsx`), camelCase para funções, e classes puras do Tailwind para estilos, mantendo `globals.css` focado apenas em tokens vitais e scrollbars.

## 4. Workflow de CI/CD para Agentes
Antes de reportar a conclusão de qualquer tarefa, o agente é **obrigado** a:
1. Limpar `imports` não utilizados (Anti-Spaghetti).
2. Executar validação de tipagem estrita via `npx tsc --noEmit`.
3. Validar se não quebrou a responsividade (Desktop vs Mobile).
4. Atualizar o `walkthrough.md` documentando o que foi alterado para manter a memória do projeto sincronizada.

*Qualquer desvio destas regras requer uma diretiva de [SYSTEM_OVERRIDE] explícita por parte do usuário.*
