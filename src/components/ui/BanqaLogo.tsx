
import React from 'react';

interface BanqaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const sizeMap = {
  sm: { container: 'h-8', icon: 'w-8 h-8', text: 'text-lg' },
  md: { container: 'h-10', icon: 'w-10 h-10', text: 'text-xl' },
  lg: { container: 'h-12', icon: 'w-12 h-12', text: 'text-2xl' },
  xl: { container: 'h-16', icon: 'w-16 h-16', text: 'text-3xl' }
};

export const BanqaLogo: React.FC<BanqaLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}) => {
  const sizes = sizeMap[size];

  const LogoIcon = () => (
    <div className={`${sizes.icon} banqa-gradient rounded-xl flex items-center justify-center shadow-lg cultural-card relative overflow-hidden`}>
      {/* African geometric pattern background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M20 5 L35 20 L20 35 L5 20 Z" fill="currentColor" opacity="0.3" />
          <circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.4" />
          <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
      
      {/* Main logo letter */}
      <span className="text-white font-bold relative z-10" style={{ fontSize: size === 'xl' ? '1.5rem' : size === 'lg' ? '1.25rem' : '1rem' }}>
        B
      </span>
      
      {/* Growth arrow indicator */}
      <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
    </div>
  );

  const LogoText = () => (
    <div className="flex flex-col">
      <h2 className={`font-bold text-primary ${sizes.text} tracking-tight`}>
        Banqa
      </h2>
      <p className="text-xs text-muted-foreground font-medium leading-none">
        Financial Freedom
      </p>
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center gap-3 ${sizes.container} ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};
