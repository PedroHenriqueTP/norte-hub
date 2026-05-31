# Micro-Learning: Developer Best Practices

Este arquivo serve como repositório de conhecimento para o *Mentorship Engine*. Cada bloco representa uma pílula de conhecimento (Dica) que o Mentor pode injetar no seu workflow no momento certo.

---
ID: GLASS_MORPHISM_STANDARD
TITLE: Consistência no GlassMorphism
CATEGORY: UI/UX
CONTENT: Notei que você está criando componentes com transparência manual. Lembre-se: no *Claro Conecta*, utilizamos o padrão `glass-chic` que adiciona `backdrop-blur` e `border-white/5` automaticamente. Usar o `GlassCard` wrapper reduz o *boilerplate* em 40% e garante a consistência visual!

---
ID: GLOBAL_STATE_MANAGEMENT
TITLE: Zustand vs Context API
CATEGORY: Architecture
CONTENT: Se você precisar compartilhar estado entre componentes isolados (como o Chatbot e o Layout), prefira sempre utilizar o Zustand. Ele previne re-renderizações desnecessárias na árvore do React, algo crítico para manter as animações do *Framer Motion* fluidas a 60 FPS.

---
ID: ERROR_BOUNDARY_AWARENESS
TITLE: Proteja seu Flow com Error Boundaries
CATEGORY: Resilience
CONTENT: Vai criar um novo componente interativo (como um jogo)? Não esqueça de envelopá-lo com o nosso `error.tsx` ou injetar o `withChaos`. Se o componente quebrar, a casca principal continua de pé. Isso é o que chamamos de *Graceful Degradation* no estado da arte.

---
ID: ATOMIC_DESIGN_RULES
TITLE: Keep it Atomic
CATEGORY: Clean Code
CONTENT: Ao construir novos Overlays, lembre-se da regra de responsabilidade única. O `GlassOverlay` cuida da renderização do Portal e animação. O conteúdo do painel/jogo deve ser um componente desacoplado injetado via `children`. Isso facilita testes isolados!
