import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const heightClasses = {
    sm: 'h-9',
    md: 'h-13 sm:h-14',
    lg: 'h-16 sm:h-20',
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img 
        src="/logo.svg" 
        alt="CV4U - Your CV, Your Future" 
        className={`${heightClasses} w-auto object-contain transition-transform hover:scale-105`} 
      />
    </div>
  );
};

export default Logo;
