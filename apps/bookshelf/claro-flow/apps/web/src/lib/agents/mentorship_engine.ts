export type MentorTip = {
  id: string;
  title: string;
  category: string;
  content: string;
};

// Simplified mock of reading from dev_best_practices.md
// In a real advanced environment, this could read the MD file from the file system.
// For the browser environment (frontend simulation), we hardcode the parsed tips.
const TIPS_LIBRARY: MentorTip[] = [
  {
    id: 'GLASS_MORPHISM_STANDARD',
    title: 'Consistência no GlassMorphism',
    category: 'UI/UX',
    content: 'Notei que você está criando componentes com transparência manual. Lembre-se: no Claro Conecta, utilizamos o padrão `glass-chic` que adiciona `backdrop-blur` e `border-white/5` automaticamente. Usar o GlassCard wrapper reduz o boilerplate em 40% e garante a consistência visual!'
  },
  {
    id: 'GLOBAL_STATE_MANAGEMENT',
    title: 'Zustand vs Context API',
    category: 'Architecture',
    content: 'Se você precisar compartilhar estado entre componentes isolados (como o Chatbot e o Layout), prefira sempre utilizar o Zustand. Ele previne re-renderizações desnecessárias na árvore do React, algo crítico para manter as animações fluidas a 60 FPS.'
  },
  {
    id: 'ERROR_BOUNDARY_AWARENESS',
    title: 'Proteja seu Flow com Error Boundaries',
    category: 'Resilience',
    content: 'Vai criar um novo componente interativo? Não esqueça de envelopá-lo com o nosso error.tsx ou injetar o withChaos. Se o componente quebrar, a casca principal continua de pé. Isso é Graceful Degradation.'
  },
  {
    id: 'ATOMIC_DESIGN_RULES',
    title: 'Keep it Atomic',
    category: 'Clean Code',
    content: 'Ao construir novos Overlays, lembre-se da regra de responsabilidade única. O GlassOverlay cuida da renderização do Portal e animação. O conteúdo do painel/jogo deve ser um componente desacoplado injetado via children. Isso facilita testes isolados!'
  }
];

export const MentorshipEngine = {
  getRandomTip: (): MentorTip => {
    const randomIndex = Math.floor(Math.random() * TIPS_LIBRARY.length);
    return TIPS_LIBRARY[randomIndex];
  },
  
  // Simulate contextual analysis based on some trigger
  analyzeContextAndProvideTip: (contextTrigger: string): MentorTip | null => {
    // In a real implementation, this would map AST or typing patterns to a specific tip.
    // For now, we simulate providing a relevant tip.
    if (contextTrigger === 'UI_CHANGE') {
      return TIPS_LIBRARY.find(t => t.id === 'GLASS_MORPHISM_STANDARD') || null;
    }
    if (contextTrigger === 'STATE_CHANGE') {
      return TIPS_LIBRARY.find(t => t.id === 'GLOBAL_STATE_MANAGEMENT') || null;
    }
    
    // Fallback to random if no explicit match
    return MentorshipEngine.getRandomTip();
  }
};
