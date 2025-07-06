
import React from 'react';

interface ModernBanqaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  theme?: 'default' | 'monochrome';
}

const sizeMap = {
  sm: { container: 'h-8', icon: 'w-8 h-8', text: 'text-lg', iconText: 'text-sm' },
  md: { container: 'h-10', icon: 'w-10 h-10', text: 'text-xl', iconText: 'text-base' },
  lg: { container: 'h-14', icon: 'w-14 h-14', text: 'text-2xl', iconText: 'text-lg' },
  xl: { container: 'h-20', icon: 'w-20 h-20', text: 'text-4xl', iconText: 'text-2xl' }
};

export const ModernBanqaLogo: React.FC<ModernBanqaLogoProps> = ({ 
  size = 'md', 
  variant = 'full', 
  className = '',
  theme = 'default'
}) => {
  const sizes = sizeMap[size];
  const isMonochrome = theme === 'monochrome';

  const LogoIcon = () => (
    <div className={`${sizes.icon} relative flex items-center justify-center`}>
      <svg 
        viewBox="0 0 48 48" 
        className="w-full h-full"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main hexagonal container with gradient */}
        <defs>
          <linearGradient id="banqaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMonochrome ? "#1e293b" : "#1e40af"} />
            <stop offset="50%" stopColor={isMonochrome ? "#334155" : "#3b82f6"} />
            <stop offset="100%" stopColor={isMonochrome ? "#0f172a" : "#1d4ed8"} />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMonochrome ? "#64748b" : "#10b981"} />
            <stop offset="100%" stopColor={isMonochrome ? "#475569" : "#059669"} />
          </linearGradient>
        </defs>
        
        {/* Hexagonal background inspired by African geometric patterns */}
        <path
          d="M24 4 L36 12 L36 28 L24 36 L12 28 L12 12 Z"
          fill="url(#banqaGradient)"
          stroke={isMonochrome ? "#64748b" : "#1e40af"}
          strokeWidth="1"
        />
        
        {/* Inner geometric pattern - African-inspired diamond */}
        <path
          d="M24 10 L30 16 L24 22 L18 16 Z"
          fill={isMonochrome ? "#f8fafc" : "#ffffff"}
          opacity="0.9"
        />
        
        {/* Digital connectivity dots */}
        <circle cx="15" cy="20" r="1.5" fill="url(#accentGradient)" />
        <circle cx="33" cy="20" r="1.5" fill="url(#accentGradient)" />
        <circle cx="24" cy="30" r="1.5" fill="url(#accentGradient)" />
        
        {/* Connection lines suggesting network/payments */}
        <path
          d="M16.5 20 L22 18 M26 18 L31.5 20 M24 28.5 L24 24"
          stroke="url(#accentGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Stylized "B" in the center */}
        <path
          d="M20 15 L20 21 M20 15 L23 15 Q25 15 25 17 Q25 18 24 18 L20 18 M20 18 L24 18 Q26 18 26 20 Q26 21 23 21 L20 21"
          stroke={isMonochrome ? "#1e293b" : "#1e40af"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );

  const LogoText = () => (
    <div className="flex flex-col justify-center">
      <h1 className={`font-bold ${sizes.text} tracking-tight leading-none`} 
          style={{ 
            color: isMonochrome ? '#1e293b' : '#1e40af',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          }}>
        Banqa
      </h1>
      <p className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium leading-none mt-0.5`}
         style={{ color: isMonochrome ? '#64748b' : '#059669' }}>
        African FinTech
      </p>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <LogoText />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${sizes.container} ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};
