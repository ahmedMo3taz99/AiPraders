import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DragDropContextType {
  isDragOver: boolean;
  setIsDragOver: (value: boolean) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, onFilesDrop: (files: File[]) => void) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the entire document
    if (e.currentTarget === document.body) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, onFilesDrop: (files: File[]) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      onFilesDrop(imageFiles);
    }
  }, []);

  return (
    <DragDropContext.Provider value={{
      isDragOver,
      setIsDragOver,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="min-h-screen"
      >
        {children}
        
        {/* Global Drag Overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-emerald-500/20 backdrop-blur-sm z-[9999] flex items-center justify-center pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900/90 border-2 border-dashed border-emerald-500 rounded-2xl p-8 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {t.chatInput.dropImagesHere}
                    </h3>
                    <p className="text-gray-300">
                      {t.chatInput.addImage}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}; 