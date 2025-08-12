import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceInputProps {
  isListening: boolean;
  onToggle: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onToggle
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-1.5 rounded-lg transition-colors ${
        isListening 
          ? 'text-emerald-400 bg-emerald-400/10' 
          : 'text-gray-400 hover:text-white hover:bg-emerald-500/20'
      }`}
    >
      <Mic size={16} />
    </button>
  );
}; 