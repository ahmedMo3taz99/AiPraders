import React, { useState } from 'react';
import { File, FileText, Download, ExternalLink, Eye, X, FileArchive, FileImage, FileVideo, FileAudio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttachedFile {
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
}

interface AttachedFilesProps {
  files: AttachedFile[];
  onRemove?: (index: number) => void;
  showRemoveButton?: boolean;
  className?: string;
}

export const AttachedFiles: React.FC<AttachedFilesProps> = ({ 
  files, 
  onRemove, 
  showRemoveButton = false,
  className = ''
}) => {
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-6 h-6 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileText className="w-6 h-6 text-green-500" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="w-6 h-6 text-blue-600" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return <FileArchive className="w-6 h-6 text-purple-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <FileVideo className="w-6 h-6 text-orange-500" />;
    } else if (mimeType.startsWith('audio/')) {
      return <FileAudio className="w-6 h-6 text-pink-500" />;
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
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'ملف مضغوط';
    if (mimeType.startsWith('video/')) return 'فيديو';
    if (mimeType.startsWith('audio/')) return 'صوت';
    return 'ملف';
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (mimeType === 'application/pdf') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    if (mimeType.startsWith('text/')) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
    if (mimeType.startsWith('video/')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    if (mimeType.startsWith('audio/')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const handleDownload = (file: AttachedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.original_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (file: AttachedFile) => {
    if (file.mime_type.startsWith('image/')) {
      setPreviewFile(file);
      setPreviewOpen(true);
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleRemove = (index: number) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`mt-4 ${className}`}>
        {/* Header */}
        <motion.div 
          className="flex items-center space-x-3 rtl:space-x-reverse mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            الملفات المرفقة
          </h4>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {files.length}
          </span>
        </motion.div>
        
        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <motion.div
              key={`${file.original_name}-${index}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm hover:scale-105"
            >
              {/* File Icon Background */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-2xl rounded-tr-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      {getFileIcon(file.mime_type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate mb-2 leading-tight">
                      {file.original_name}
                    </p>
                    
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFileTypeColor(file.mime_type)}`}>
                        {getFileTypeText(file.mime_type)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {formatFileSize(file.file_size)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <motion.button
                        onClick={() => handlePreview(file)}
                        className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
                        title={file.mime_type.startsWith('image/') ? 'معاينة الصورة' : 'فتح الملف'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {file.mime_type.startsWith('image/') ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <ExternalLink className="w-3 h-3" />
                        )}
                        <span className="font-semibold">{file.mime_type.startsWith('image/') ? 'معاينة' : 'فتح'}</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDownload(file)}
                        className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 hover:scale-105"
                        title="تحميل الملف"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-3 h-3" />
                        <span className="font-semibold">تحميل</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  {showRemoveButton && onRemove && (
                    <motion.button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100"
                      title="إزالة الملف"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Image Preview Modal */}
      <AnimatePresence>
        {previewOpen && previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500">
                <h3 className="text-xl font-bold text-white">
                  {previewFile.original_name}
                </h3>
                <motion.button
                  onClick={() => setPreviewOpen(false)}
                  className="p-2 text-white/80 hover:text-white transition-colors rounded-xl hover:bg-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
              
              {/* Image Container */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900">
                <div className="relative">
                  <img
                    src={previewFile.url}
                    alt={previewFile.original_name}
                    className="max-w-full max-h-96 object-contain rounded-xl shadow-lg"
                  />
                  
                  {/* Image Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">{formatFileSize(previewFile.file_size)}</span>
                        <span className="mx-2">•</span>
                        <span>{getFileTypeText(previewFile.mime_type)}</span>
                      </div>
                      <motion.button
                        onClick={() => handleDownload(previewFile)}
                        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Download className="w-4 h-4" />
                        <span className="font-semibold">تحميل</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 