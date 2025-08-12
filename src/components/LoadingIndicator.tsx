import React from 'react';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'جاري التحميل...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 text-sm"
      >
        {message}
      </motion.p>
    </div>
  );
}; 