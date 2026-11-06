import React from 'react';

interface FBCLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'blue' | 'image' | 'dark';
  showSubtext?: boolean;
}

export const FBCLogo: React.FC<FBCLogoProps> = ({
  className = '',
  size = 'md',
  showSubtext = false,
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-18 sm:h-22',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative inline-flex items-center justify-center overflow-hidden rounded-xl">
        <img
          src="/assets/aistudio/IMG-20261106-WA0006_9fd08494.jpg"
          alt="FBC Bank Zimbabwe Logo"
          className={`${sizeClasses} w-auto object-contain drop-shadow-xs transition-transform hover:scale-[1.02]`}
          loading="eager"
        />
      </div>

      {showSubtext && (
        <div className="hidden sm:flex flex-col leading-none text-left">
          <span className="text-xs font-bold text-[#0047BA] uppercase tracking-wider">
            Bank Zimbabwe
          </span>
          <span className="text-[10px] text-slate-400 font-serif italic mt-0.5">
            You Matter Most
          </span>
        </div>
      )}
    </div>
  );
};
