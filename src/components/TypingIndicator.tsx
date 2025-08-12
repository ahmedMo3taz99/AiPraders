import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

export const TypingIndicator: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="message-container bot group">
      <div className="message-avatar bot">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <img src={logo} alt="Pro Traders Group" className="w-5 h-5" />
        </div>
      </div>
      
      <div className="message-content">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-emerald-400 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-emerald-400 rounded-full"
            />
          </div>
          
          <span className="text-gray-300 text-sm">{t.typingIndicator.text}</span>
        </div>
      </div>
    </div>
  );
}; 