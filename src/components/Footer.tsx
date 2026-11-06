import React from 'react';

interface FooterProps {
  variant?: 'light' | 'blue';
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const isBlue = variant === 'blue';

  if (isBlue) {
    return (
      <footer className="w-full py-4 text-center text-xs text-white/80 select-none z-10">
        <p className="font-medium tracking-wide">
          © 2026 FBC Holdings Limited. Registered Commercial Bank. All rights reserved.
        </p>
      </footer>
    );
  }

  return (
    <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-slate-200 mt-auto bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <p className="font-medium">
          © 2026 FBC Holdings Limited. Registered Commercial Bank. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
