import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Image, Paperclip, X, Camera, FileText } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface ChatInputProps {
  onSendMessage: (message: string, images?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
}) => {
  const { t, direction } = useLanguage();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (message.trim() || selectedImages.length > 0) &&
      !disabled &&
      !isLoading
    ) {
      onSendMessage(message.trim(), selectedImages);
      setMessage("");
      setSelectedImages([]);
      setImagePreviewUrls([]);
    }
  };

  const handleSendClick = () => {
    if (
      (message.trim() || selectedImages.length > 0) &&
      !disabled &&
      !isLoading
    ) {
      onSendMessage(message.trim(), selectedImages);
      setMessage("");
      setSelectedImages([]);
      setImagePreviewUrls([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice input logic would go here
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length > 0) {
      const newImages = [...selectedImages, ...imageFiles];
      setSelectedImages(newImages);

      // Create preview URLs
      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviewUrls((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (e.target) e.target.value = "";
  };

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (e.target) e.target.value = "";
  };

  const handleDocumentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Handle document files
    if (e.target.files) {
      console.log("Document files:", e.target.files);
      // Here you would handle document upload
    }
    if (e.target) e.target.value = "";
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const dropdownItems = [
    {
      icon: Image,
      label: t.chatInput.addImage,
      action: () => fileInputRef.current?.click(),
      accept: "image/*",
    },
    {
      icon: Camera,
      label: t.chatInput.takePhoto,
      action: () => cameraInputRef.current?.click(),
      accept: "image/*",
    },
    {
      icon: FileText,
      label: t.chatInput.uploadFile,
      action: () => documentInputRef.current?.click(),
      accept: "*/*",
    },
  ];

  return (
    <div className="relative ">
      {/* خلفية متدرجة مشابهة للـ Welcome */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,214,160,0.1),transparent_50%)]"></div>

      {/* شبكة هندسية */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)
          `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 p-6 border-t border-emerald-500/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="relative ">
              {/* Drag and Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative transition-all duration-300 ${
                  isDragOver ? "bg-emerald-500/10 border-emerald-500/50" : ""
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.chatInput.placeholder}
                  disabled={disabled || isLoading}
                  className={`w-full bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-6 py-4 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ${
                    isDragOver ? "border-emerald-500/50" : ""
                  } mobile:pr-4`}
                  rows={1}
                  style={{
                    minHeight: "60px",
                    maxHeight: "200px",
                    fontSize: "16px",
                    boxShadow:
                      "0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
                  }}
                />

                {/* Drag Overlay */}
                <AnimatePresence>
                  {isDragOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500/10 border-2 border-dashed border-emerald-500/50 rounded-2xl flex items-center justify-center pointer-events-none backdrop-blur-sm"
                    >
                      <div className="text-center">
                        <Image className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-500 font-medium">
                          {t.chatInput.dropImagesHere}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop Icons - Only show on desktop */}
              <div
                className={`hidden md:flex absolute ${
                  direction === "rtl" ? "left-4" : "right-4"
                } top-1/2 transform -translate-y-1/2 items-center gap-3`}
              >
                {/* Dropdown Button */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 group backdrop-blur-sm bg-gray-800/50 border border-gray-600/50 hover:border-emerald-500/50"
                    title={t.chatInput.addFiles}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Paperclip
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute bottom-full mb-3 ${
                          direction === "rtl" ? "right-0" : "left-0"
                        } bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-xl z-50 min-w-48 overflow-hidden`}
                        style={{
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <div className="py-2">
                          {dropdownItems.map((item, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              onClick={() => {
                                item.action();
                                setShowDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-all duration-300 text-left"
                              whileHover={{ x: 5 }}
                            >
                              <item.icon
                                size={18}
                                className="text-emerald-400"
                              />
                              <span className="text-sm">{item.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Voice Button */}
                <motion.button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-gray-600/50 ${
                    isListening
                      ? "text-red-400 bg-red-400/20 border-red-500/50"
                      : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 bg-gray-800/50 hover:border-emerald-500/50"
                  }`}
                  title={t.chatInput.voice}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Mic
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                </motion.button>

                {/* Send Button */}
                <motion.button
                  type="submit"
                  disabled={
                    (!message.trim() && selectedImages.length === 0) ||
                    disabled ||
                    isLoading
                  }
                  className={`p-3 rounded-xl transition-all duration-300 group border ${
                    (message.trim() || selectedImages.length > 0) &&
                    !disabled &&
                    !isLoading
                      ? "text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-emerald-500/50 hover:border-emerald-400"
                      : "text-gray-500 bg-gray-700/50 cursor-not-allowed border-gray-600/50"
                  }`}
                  title={t.chatInput.send}
                  whileHover={
                    (message.trim() || selectedImages.length > 0) &&
                    !disabled &&
                    !isLoading
                      ? { scale: 1.1 }
                      : {}
                  }
                  whileTap={
                    (message.trim() || selectedImages.length > 0) &&
                    !disabled &&
                    !isLoading
                      ? { scale: 0.95 }
                      : {}
                  }
                  style={{
                    boxShadow:
                      (message.trim() || selectedImages.length > 0) &&
                      !disabled &&
                      !isLoading
                        ? "0 6px 20px rgba(16, 185, 129, 0.4)"
                        : "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Send
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                </motion.button>
              </div>
            </form>

            {/* Mobile Icons - Show only on mobile, below the input */}
            <div className="md:hidden flex items-center justify-center gap-4 mt-4">
              {/* Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-4 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 group bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/50 min-w-14 min-h-14 flex items-center justify-center"
                  title={t.chatInput.addFiles}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Paperclip
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute bottom-full mb-3 ${
                        direction === "rtl" ? "right-0" : "left-0"
                      } bg-gray-900/90 backdrop-blur-sm border border-gray-600/50 rounded-xl shadow-xl z-50 min-w-56 overflow-hidden`}
                      style={{
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <div className="py-2">
                        {dropdownItems.map((item, index) => (
                          <motion.button
                            key={index}
                            type="button"
                            onClick={() => {
                              item.action();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/10 transition-all duration-300 text-left"
                            whileHover={{ x: 5 }}
                          >
                            <item.icon size={18} className="text-emerald-400" />
                            <span className="text-base">{item.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Voice Button */}
              <motion.button
                type="button"
                onClick={handleVoiceToggle}
                className={`p-4 rounded-xl transition-all duration-300 group backdrop-blur-sm border border-gray-700/50 min-w-14 min-h-14 flex items-center justify-center ${
                  isListening
                    ? "text-red-400 bg-red-500/20 border-red-500/50"
                    : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 bg-gray-900/70 hover:border-emerald-500/50"
                }`}
                title={t.chatInput.voice}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Mic
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </motion.button>

              {/* Send Button */}
              <motion.button
                type="button"
                onClick={handleSendClick}
                disabled={
                  (!message.trim() && selectedImages.length === 0) ||
                  disabled ||
                  isLoading
                }
                className={`p-4 rounded-xl transition-all duration-300 group border min-w-14 min-h-14 flex items-center justify-center ${
                  (message.trim() || selectedImages.length > 0) &&
                  !disabled &&
                  !isLoading
                    ? "text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-emerald-500/50 hover:border-emerald-400"
                    : "text-gray-500 bg-gray-600/50 cursor-not-allowed border-gray-600/50"
                }`}
                title={t.chatInput.send}
                whileHover={
                  (message.trim() || selectedImages.length > 0) &&
                  !disabled &&
                  !isLoading
                    ? { scale: 1.1 }
                    : {}
                }
                whileTap={
                  (message.trim() || selectedImages.length > 0) &&
                  !disabled &&
                  !isLoading
                    ? { scale: 0.95 }
                    : {}
                }
                style={{
                  boxShadow:
                    (message.trim() || selectedImages.length > 0) &&
                    !disabled &&
                    !isLoading
                      ? "0 6px 20px rgba(16, 185, 129, 0.4)"
                      : "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Send
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
              </motion.button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraInputChange}
              className="hidden"
            />
            <input
              ref={documentInputRef}
              type="file"
              multiple
              onChange={handleDocumentInputChange}
              className="hidden"
            />
          </motion.div>
        </div>

        {/* Image Previews */}
        <AnimatePresence>
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 bg-gray-900/70 backdrop-blur-sm rounded-2xl border border-gray-600/50 max-w-4xl mx-auto"
              style={{
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Image size={16} className="text-emerald-400" />
                <span className="text-sm text-gray-300">
                  {selectedImages.length}{" "}
                  {selectedImages.length === 1
                    ? t.chatInput.imagesSelected
                    : t.chatInput.imagesSelectedPlural}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {imagePreviewUrls.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-600/50 shadow-lg"
                    />
                    <motion.button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice wave indicator */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-4 max-w-4xl mx-auto"
          >
            <div className="voice-wave bg-gray-900/70 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-600/50">
              <div className="flex items-center gap-2">
                <div className="voice-bar bg-emerald-400"></div>
                <div className="voice-bar bg-emerald-400"></div>
                <div className="voice-bar bg-emerald-400"></div>
                <div className="voice-bar bg-emerald-400"></div>
                <div className="voice-bar bg-emerald-400"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
