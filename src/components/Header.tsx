import React from 'react';
import { FBCLogo } from './FBCLogo';
import { HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSupport: () => void;
  onGoHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSupport,
  onGoHome,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onGoHome}
            className="text-left cursor-pointer transition-opacity hover:opacity-90 flex items-center"
            title="FBC Bank"
          >
            <FBCLogo size="md" />
          </button>

          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#0047BA] hover:text-[#003893] bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </header>
  );
};
