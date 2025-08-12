import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxFileSize = 10, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return { isValid: false, error: `الملف ${file.name} أكبر من ${maxFileSize}MB` };
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return { isValid: false, error: `نوع الملف ${file.name} غير مدعوم` };
    }

    return { isValid: true };
  }, [maxFileSize, acceptedTypes]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Check file count
    if (selectedFiles.length + fileArray.length > maxFiles) {
      newErrors.push(`يمكن رفع ${maxFiles} ملفات كحد أقصى`);
    }

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      if (!validation.isValid) {
        newErrors.push(validation.error!);
        return;
      }

      // Check for duplicate files
      const isDuplicate = selectedFiles.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        newErrors.push(`الملف ${file.name} موجود بالفعل`);
        return;
      }

      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
      return;
    }

    const updatedFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);

    // Simulate upload progress
    validFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[file.name] || 0;
          if (current >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [file.name]: current + 10 };
        });
      }, 100);
    });
  }, [selectedFiles, maxFiles, validateFile, onFilesSelected]);

  const removeFile = useCallback((index: number) => {
    const fileToRemove = selectedFiles[index];
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
    
    // Remove from progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileToRemove.name];
      return newProgress;
    });
  }, [selectedFiles, onFilesSelected]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (file.type.startsWith('text/')) {
      return <FileText className="w-6 h-6 text-green-500" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="w-6 h-6 text-blue-600" />;
    } else {
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeText = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'صورة';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType.startsWith('text/')) return 'ملف نصي';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'مستند Word';
    return 'ملف';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Simple File Upload Area */}
      <motion.div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:from-blue-900/30 dark:hover:via-purple-900/30 dark:hover:to-pink-900/30"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-pink-400 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="relative z-10 p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Icon */}
            <div className="relative mb-6">
              <motion.div
                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-white"
                >
                  <Cloud className="h-10 w-10" />
                </motion.div>
              </motion.div>
              
              {/* Floating Icons */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Upload className="h-4 w-4 text-white" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <File className="h-3 w-3 text-white" />
              </motion.div>
            </div>
            
            {/* Title */}
            <motion.h3 
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3"
            >
              رفع الملفات
            </motion.h3>
            
            {/* Description */}
            <motion.p 
              className="text-gray-600 dark:text-gray-400 mb-6 text-lg"
            >
              اضغط على الزر أدناه لاختيار الملفات
            </motion.p>
            
            {/* Upload Button */}
            <motion.button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Upload className="h-5 w-5" />
                <span>اختر الملفات</span>
              </div>
            </motion.button>
            
            {/* File Type Icons */}
            <div className="flex justify-center space-x-4 rtl:space-x-reverse mb-6 mt-8">
              <motion.div 
                className="flex flex-col items-center space-y-2 rtl:space-y-reverse"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">صور</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-2 rtl:space-y-reverse"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">PDF</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center space-y-2 rtl:space-y-reverse"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">نصوص</span>
              </motion.div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {maxFiles}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">الحد الأقصى</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {maxFileSize}MB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">حجم الملف</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 space-y-2"
          >
            {errors.map((error, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 rtl:space-x-reverse bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl shadow-lg"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                الملفات المحددة
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium">
                {selectedFiles.length} من {maxFiles}
              </span>
            </div>
            
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      {getFileIcon(file)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {file.name}
                        </p>
                        {uploadProgress[file.name] === 100 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-500"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">
                          {getFileTypeText(file.type)}
                        </span>
                        <span>•</span>
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                      </div>
                      
                      {/* Upload Progress */}
                      {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span className="font-medium">جاري الرفع...</span>
                            <span className="font-bold">{uploadProgress[file.name]}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress[file.name]}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
                      title="إزالة الملف"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 