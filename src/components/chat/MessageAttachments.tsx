import React from 'react';
import { File, Image, FileText, Download, ExternalLink, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { AttachedFile } from '../../types';

interface MessageAttachmentsProps {
  files: AttachedFile[];
  className?: string;
}

export const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ 
  files, 
  className = '' 
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (mimeType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileText className="w-4 h-4 text-green-500" />;
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-600" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      window.open(file.url, '_blank');
    } else {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className={`mt-2 ${className}`}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        الملفات المرفقة ({files.length})
      </div>
      
      <div className="space-y-2">
        {files.map((file, index) => (
          <motion.div
            key={`${file.original_name}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0">
              {getFileIcon(file.mime_type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.original_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.file_size)}
              </p>
            </div>
            
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <button
                onClick={() => handlePreview(file)}
                className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                title={file.mime_type.startsWith('image/') ? 'معاينة الصورة' : 'فتح الملف'}
              >
                {file.mime_type.startsWith('image/') ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <ExternalLink className="w-3 h-3" />
                )}
              </button>
              
              <button
                onClick={() => handleDownload(file)}
                className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded"
                title="تحميل الملف"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 