# Skill: System Polisher (The Finisher)

## Descrição
Esta skill é responsável por elevar o nível da aplicação de "Funcional" para "Perfeita". Ela analisa componentes em busca de falhas de UX, falta de feedback visual, inconsistências de design e bugs de borda.

## 1. O "Padrão Ouro" (Definition of Done)
Antes de considerar uma tarefa finalizada, verifique se ela atende aos 4 Pilares do Polimento:

### A. Feedback Visual (O sistema conversa?)
- [ ] Estados de Loading: Skeletons ou Spinners em todas as requisições?
- [ ] Estados Vazios: Se a lista estiver vazia, há uma ilustração amigável ou texto explicativo?
- [ ] Feedback de Ação: Toasts de sucesso/erro após formulários? (Ex: Sonner/React-Hot-Toast).
- [ ] Interatividade: Todos os botões têm `:hover`, `:active` e `:disabled`?

### B. Estética & Movimento (O sistema encanta?)
- [ ] Motion: Entradas suaves (Framer Motion) ou secas?
- [ ] Espaçamento: As margens (padding/gap) são consistentes com o sistema de design?
- [ ] Responsividade: Quebra bonitinho no Mobile (flex-col) e Desktop (grid)?

### C. Robustez (O sistema aguenta?)
- [ ] Error Boundaries: Se a API falhar, o app crasha ou mostra um "Tentar Novamente"?
- [ ] Validação: Zod está impedindo inputs inválidos antes de enviar?

## 2. Protocolo de Auditoria
Quando o usuário pedir "Analise a tela X" ou "Pole o componente Y":
1. Leia o código do arquivo.
2. Execute `scripts/ux_audit.py` (simulado) para checar padrões ausentes.
3. Gere um Relatório de Polimento com itens "Críticos" (funcionalidade) e "Melhorias" (visual).

## 3. Modo de Implementação
Ao corrigir:
- Nunca remova lógica existente. Envolva-a.
- Adicione `AnimatePresence` se for uma lista que muda.
- Troque `alert()` por componentes de Toast UI.
