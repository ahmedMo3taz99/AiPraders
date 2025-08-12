import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image, Paperclip, X } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  onSendMessageWithFiles?: (message: string, files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendMessageWithFiles,
  placeholder = "اكتب رسالتك هنا...",
  disabled = false,
  isLoading = false,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (disabled || isLoading) return;

    if (selectedFiles.length > 0 && onSendMessageWithFiles) {
      onSendMessageWithFiles(message.trim(), selectedFiles);
    } else {
      onSendMessage(message.trim(), selectedFiles);
    }

    setMessage('');
    setSelectedFiles([]);
    setShowFileUpload(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, selectedFiles, disabled, isLoading, onSendMessage, onSendMessageWithFiles]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleFileUpload = useCallback(() => {
    setShowFileUpload(prev => !prev);
  }, []);

  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    // TODO: Implement voice recording
  }, []);

  const canSend = message.trim().length > 0 || selectedFiles.length > 0;

  return (
    <div className={`w-full ${className}`}>
      {/* File Upload Section */}
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <FileUpload
              onFilesSelected={handleFilesSelected}
              maxFiles={5}
              maxFileSize={10}
              className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Files Preview */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                    الملفات المحددة
                  </h4>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {selectedFiles.length}
                  </span>
                </div>
                <motion.button
                  onClick={() => setSelectedFiles([])}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-white dark:bg-gray-800 rounded-xl p-3 border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Image className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <motion.button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Input */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all duration-300 overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          <div className="flex items-end space-x-3 rtl:space-x-reverse p-4">
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <motion.button
                type="button"
                onClick={toggleFileUpload}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  showFileUpload
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
                title="إرفاق ملفات"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isRecording
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse'
                    : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                title="تسجيل صوتي"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                type="button"
                className="p-3 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-xl transition-all duration-200"
                title="إضافة رمز تعبيري"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* <Smile className="w-5 h-5" /> */}
              </motion.button>
            </div>

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                className="w-full resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm leading-relaxed min-h-[20px] max-h-[120px] font-medium"
                rows={1}
              />
            </div>

            {/* Send Button */}
            <motion.button
              type="button"
              onClick={handleSend}
              disabled={!canSend || disabled || isLoading}
              className={`p-4 rounded-xl transition-all duration-300 ${
                canSend && !disabled && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              title="إرسال الرسالة"
              whileHover={canSend && !disabled && !isLoading ? { scale: 1.05 } : {}}
              whileTap={canSend && !disabled && !isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : canSend ? (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Send className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Recording Indicator */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 px-4 py-3"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    جاري التسجيل...
                  </span>
                  <motion.button
                    onClick={toggleRecording}
                    className="ml-auto text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    إيقاف
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Helper Text */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* <Zap className="w-3 h-3 text-yellow-500" /> */}
          <span>اضغط Enter للإرسال، Shift+Enter للسطر الجديد</span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* <Sparkles className="w-3 h-3 text-purple-500" /> */}
          <span className="font-medium">{message.length}/5000</span>
        </div>
      </div>
    </div>
  );
}; 