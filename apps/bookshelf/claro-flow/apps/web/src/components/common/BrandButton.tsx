import React from 'react';
import { DESIGN_TOKENS } from '../../styles/design_tokens';

type BrandButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
};

export const BrandButton: React.FC<BrandButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  ...props
}) => {
  const baseStyles = 'transition-all font-bold rounded-xl flex items-center justify-center';
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Mapeamento de estilos usando Tokens onde aplicável via estilos inline, 
  // ou definindo as classes utilitárias que refletem a paleta base.
  let variantStyles = '';
  let customStyle: React.CSSProperties = {};

  if (variant === 'primary') {
    variantStyles = 'text-white border border-transparent hover:shadow-lg';
    customStyle = { 
      backgroundColor: DESIGN_TOKENS.colors.brand.red,
      // Hover effect is handled via tailwind utility in global or inline
    };
  } else if (variant === 'secondary') {
    variantStyles = 'bg-white/5 hover:bg-white/10 text-white border border-white/10';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent border text-[#ee1d23] hover:bg-[#ee1d23]/10';
    customStyle = {
      borderColor: DESIGN_TOKENS.colors.brand.red,
      color: DESIGN_TOKENS.colors.brand.red
    };
  }

  return (
    <button 
      className={`${baseStyles} ${widthStyle} ${variantStyles} py-3 px-6 ${className}`}
      style={customStyle}
      {...props}
    >
      {children}
    </button>
  );
};
