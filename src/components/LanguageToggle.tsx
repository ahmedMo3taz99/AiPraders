import React from 'react';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: string;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onToggle
}) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-emerald-500/20 rounded-lg transition-colors"
    >
      <Globe size={16} />
      <span className="text-sm">{language === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}; 