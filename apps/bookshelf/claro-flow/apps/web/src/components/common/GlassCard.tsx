import React from 'react';
import { DESIGN_TOKENS } from '../../styles/design_tokens';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  withNeonGlow?: boolean;
  padding?: 'none' | 'normal' | 'large';
};

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  withNeonGlow = false,
  padding = 'normal'
}) => {
  const paddingMap = {
    none: 'p-0',
    normal: 'p-6',
    large: 'p-8',
  };

  const glowStyle = withNeonGlow ? { boxShadow: DESIGN_TOKENS.effects.shadow.neonGlow } : {};

  return (
    <div 
      className={`glass-chic border border-white/5 bg-gradient-to-br from-white/5 to-transparent rounded-3xl ${paddingMap[padding]} ${className} relative overflow-hidden`}
      style={glowStyle}
    >
      {children}
    </div>
  );
};
