import React from 'react';
import { Copy, Heart, Check } from 'lucide-react';
import { AttachedFile } from '../types';
import logo from '../assets/logo.png';

interface MessageProps {
  content: string;
  isUser: boolean;
  isFavorite?: boolean;
  files?: AttachedFile[];
  onCopy?: () => void;
  onFavorite?: () => void;
}

export const Message: React.FC<MessageProps> = ({
  content,
  isUser,
  isFavorite = false,
  onCopy,
  onFavorite
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    onCopy?.();
  };

  return (
    <div className={`message-container ${isUser ? 'user' : 'bot'} group`}>
      <div className={`message-avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <img src={logo} alt="Pro Traders Group" className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="message-content">
        <div className={`message-text ${isUser ? 'user' : 'bot'}`}>
          {content}
        </div>
        
        {/* Message Actions */}
        <div className="message-actions">
          <button
            onClick={handleCopy}
            className="action-button"
            title="نسخ الرسالة"
          >
            <Copy size={14} />
          </button>
          
          {!isUser && (
            <button
              onClick={onFavorite}
              className={`action-button ${isFavorite ? 'text-red-400' : ''}`}
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              {isFavorite ? <Check size={14} /> : <Heart size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 