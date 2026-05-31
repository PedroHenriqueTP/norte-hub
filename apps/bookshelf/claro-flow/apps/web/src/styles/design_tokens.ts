/**
 * Claro Conecta - Design Tokens
 * 
 * Fonte da verdade para a estética do sistema.
 * Não utilize valores literais em componentes; sempre importe destes tokens ou utilize a abstração atômica baseada neles.
 */

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      red: '#ee1d23',
      redDark: '#c9181e',
      redNeonGlow: 'rgba(238,29,35,0.4)',
    },
    surface: {
      glassPanel: 'rgba(255,255,255,0.05)',
      glassPanelHover: 'rgba(255,255,255,0.1)',
      borderChic: 'rgba(255,255,255,0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8a8f98',
      muted: '#64748b',
    }
  },
  effects: {
    blur: {
      sm: 'blur(4px)',
      md: 'blur(10px)',
      lg: 'blur(20px)',
    },
    shadow: {
      neonGlow: '0 0 15px rgba(238, 29, 35, 0.4)',
      deepGlow: '0 4px 25px rgba(238, 29, 35, 0.6)',
    }
  },
  spacing: {
    padding: {
      card: '1.5rem', // 24px
      button: '0.75rem 1.5rem',
    },
    radius: {
      card: '1.5rem', // 24px
      button: '0.75rem', // 12px
    }
  }
} as const;
