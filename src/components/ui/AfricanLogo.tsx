
import React from 'react';

interface AfricanLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const AfricanLogo: React.FC<AfricanLogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16'
  };

  const iconSize = {
    sm: '32',
    md: '40', 
    lg: '64'
  };

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const AfricanIcon = () => (
    <svg 
      width={iconSize[size]} 
      height={iconSize[size]} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* African continent silhouette */}
      <path
        d="M20 4C18 4 16 5 15 7C14 8 13 10 14 12C15 14 16 15 17 17C18 19 19 20 20 22C21 20 22 19 23 17C24 15 25 14 26 12C27 10 26 8 25 7C24 5 22 4 20 4Z"
        className="fill-primary"
      />
      {/* Traditional patterns */}
      <circle cx="20" cy="12" r="2" className="fill-accent" />
      <circle cx="17" cy="16" r="1.5" className="fill-secondary" />
      <circle cx="23" cy="16" r="1.5" className="fill-secondary" />
      
      {/* Economic growth symbol - ascending bars */}
      <rect x="12" y="28" width="2" height="6" className="fill-primary" rx="1" />
      <rect x="16" y="26" width="2" height="8" className="fill-accent" rx="1" />
      <rect x="20" y="24" width="2" height="10" className="fill-primary" rx="1" />
      <rect x="24" y="22" width="2" height="12" className="fill-secondary" rx="1" />
      <rect x="28" y="20" width="2" height="14" className="fill-accent" rx="1" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`flex items-center ${className}`}>
        <AfricanIcon />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AfricanIcon />
      <div className="flex flex-col">
        <span className={`font-bold text-primary ${textSize[size]} leading-none`}>
          Banqa
        </span>
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          African FinTech
        </span>
      </div>
    </div>
  );
};
