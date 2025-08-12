import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-green-600';
      case 'error':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      default:
        return 'bg-gradient-to-r from-emerald-500 to-green-600';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.3 }}
        className={`fixed top-4 right-4 ${getBgColor()} text-white px-4 py-3 rounded-lg shadow-lg z-[10000] flex items-center gap-3 min-w-[300px]`}
      >
        {getIcon()}
        <span className="flex-1 text-sm">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}; 