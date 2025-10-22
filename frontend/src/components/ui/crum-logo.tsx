import React from 'react';

interface CrumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
};

export function CrumLogo({ size = 'md', className = '' }: CrumLogoProps) {
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#f59e0b', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#d97706', stopOpacity:1}} />
          </linearGradient>
          <linearGradient id="crumb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:1}} />
          </linearGradient>
        </defs>

        {/* Main bread crumb */}
        <ellipse cx="16" cy="18" rx="12" ry="8" fill="url(#gradient)" opacity="0.9"/>

        {/* Smaller crumbs scattered around */}
        <ellipse cx="8" cy="12" rx="3" ry="2" fill="url(#crumb-gradient)" opacity="0.8"/>
        <ellipse cx="24" cy="14" rx="2.5" ry="1.8" fill="url(#crumb-gradient)" opacity="0.7"/>
        <ellipse cx="6" cy="22" rx="2" ry="1.5" fill="url(#crumb-gradient)" opacity="0.6"/>
        <ellipse cx="26" cy="20" rx="2.8" ry="2" fill="url(#crumb-gradient)" opacity="0.8"/>

        {/* Tiny crumbs */}
        <circle cx="12" cy="8" r="1" fill="url(#crumb-gradient)" opacity="0.5"/>
        <circle cx="20" cy="10" r="0.8" fill="url(#crumb-gradient)" opacity="0.4"/>
        <circle cx="4" cy="16" r="0.6" fill="url(#crumb-gradient)" opacity="0.3"/>
        <circle cx="28" cy="24" r="0.7" fill="url(#crumb-gradient)" opacity="0.4"/>
      </svg>
    </div>
  );
}
