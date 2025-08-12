import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: File | null;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  selectedImage,
  disabled = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  }, [onImageUpload, disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="image-preview"
          >
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="rounded-xl shadow-lg"
            />
            <button
              onClick={onImageRemove}
              className="image-remove"
              title="إزالة الصورة"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {!selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`image-upload-area ${isDragOver ? 'dragover' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                                  <ImageIcon size={32} className="text-emerald-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {isDragOver ? 'أفلت الصورة هنا' : 'إرسال صورة'}
              </h3>
              <p className="text-gray-400 text-sm">
                اسحب وأفلت صورة هنا، أو انقر للاختيار
              </p>
              <p className="text-gray-500 text-xs">
                يدعم: JPG, PNG, GIF (الحد الأقصى: 5MB)
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
              disabled={disabled}
            >
              <Upload size={16} className="ml-2" />
              اختيار صورة
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 