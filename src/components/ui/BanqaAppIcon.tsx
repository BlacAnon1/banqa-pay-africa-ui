
import React from 'react';

interface BanqaAppIconProps {
  size?: number;
  className?: string;
  theme?: 'default' | 'monochrome';
}

export const BanqaAppIcon: React.FC<BanqaAppIconProps> = ({ 
  size = 40, 
  className = '',
  theme = 'default'
}) => {
  const isMonochrome = theme === 'monochrome';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-xl shadow-lg"
      >
        <defs>
          <linearGradient id="appIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMonochrome ? "#1e293b" : "#1e40af"} />
            <stop offset="50%" stopColor={isMonochrome ? "#334155" : "#3b82f6"} />
            <stop offset="100%" stopColor={isMonochrome ? "#0f172a" : "#1d4ed8"} />
          </linearGradient>
          <linearGradient id="appAccentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isMonochrome ? "#64748b" : "#10b981"} />
            <stop offset="100%" stopColor={isMonochrome ? "#475569" : "#f97316"} />
          </linearGradient>
        </defs>
        
        {/* Rounded background */}
        <rect width="48" height="48" rx="12" fill="url(#appIconGradient)" />
        
        {/* African geometric pattern - simplified for app icon */}
        <path
          d="M24 8 L32 16 L24 24 L16 16 Z"
          fill={isMonochrome ? "#f8fafc" : "#ffffff"}
          opacity="0.9"
        />
        
        {/* Connectivity elements */}
        <circle cx="12" cy="24" r="2" fill="url(#appAccentGradient)" />
        <circle cx="36" cy="24" r="2" fill="url(#appAccentGradient)" />
        <circle cx="24" cy="36" r="2" fill="url(#appAccentGradient)" />
        
        {/* Connection lines */}
        <path
          d="M14 24 L22 20 M26 20 L34 24 M24 34 L24 26"
          stroke="url(#appAccentGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Bold "B" */}
        <path
          d="M18 12 L18 20 M18 12 L22 12 Q24 12 24 14 Q24 15 23 15 L18 15 M18 15 L23 15 Q25 15 25 17 Q25 20 22 20 L18 20"
          stroke={isMonochrome ? "#1e293b" : "#1e40af"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
