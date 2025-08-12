import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { ChatInput } from "./components/ChatInput";
import { Message } from "./components/Message";
import { Welcome } from "./components/Welcome";
import { TypingIndicator } from "./components/TypingIndicator";
import { SettingsModal } from "./components/SettingsModal";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { Toast } from "./components/Toast";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";

import { useChat } from "./hooks/useChat";
import { useAuth } from "./contexts/AuthContext";
import { useLanguage } from "./contexts/LanguageContext";

type AuthView = "login" | "register" | "forgot-password";

export const App: React.FC = () => {
  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { user, isLoading: authLoading } = useAuth();
  const { direction } = useLanguage();

  const {
    messages,
    chatHistory,
    favorites,
    isLoading,
    currentSessionId,
    toasts,
    sendMessage,
    sendMessageWithFiles,
    newSession,
    loadSession,
    deleteConversation,
    toggleFavorite,
    removeToast,
  } = useChat();

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll for scroll indicator
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollIndicator(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if device is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Set sidebar state based on device
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNewChat = () => {
    // Close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }

    // Check if current session has messages before creating new one
    if (messages.length > 0) {
      newSession();
    } else {
      // If no messages, just create a new session without validation
      newSession();
    }
  };

  const handleLoadSession = (sessionId: string) => {
    // Close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }

    loadSession(sessionId);
  };

  const handleDeleteConversation = (sessionId: string) => {
    deleteConversation(sessionId);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = async (message: string, files?: File[]) => {
    if (files && files.length > 0) {
      // Use sendMessageWithFiles when files are present
      await sendMessageWithFiles(message, files);
    } else {
      // Use regular sendMessage when no files
      await sendMessage(message);
    }
  };

  const handleSendSuggestedMessage = (message: string) => {
    handleSendMessage(message);
  };

  const handleCopyMessage = () => {
    // copyMessage is no longer available from useChat, so this function will be removed or refactored
    // For now, we'll just log a placeholder message
    console.log("Copy message functionality is not available.");
  };

  const handleToggleFavorite = (messageId: string) => {
    toggleFavorite(messageId);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  // Show authentication forms if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Enhanced dark background with green accents */}
        <div className="absolute inset-0">
          {/* Large gradient orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-0 right-0 w-80 h-80 bg-green-500/12 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-400/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />

          {/* Floating particles */}
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400/50 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-emerald-300/40 rounded-full animate-bounce"
            style={{ animationDelay: "2.5s" }}
          />
          <div
            className="absolute top-2/3 right-1/4 w-1 h-1 bg-green-300/50 rounded-full animate-bounce"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-emerald-400/30 rounded-full animate-bounce"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-green-400/40 rounded-full animate-bounce"
            style={{ animationDelay: "3.5s" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {authView === "login" && (
                <LoginForm
                  key="login"
                  onSwitchToRegister={() => setAuthView("register")}
                  onForgotPassword={() => setAuthView("forgot-password")}
                />
              )}
              {authView === "register" && (
                <RegisterForm
                  key="register"
                  onSwitchToLogin={() => setAuthView("login")}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="chatgpt-layout">
      {/* Sidebar Overlay for Mobile/Tablet */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: direction === "rtl" ? 320 : -320 }}
            animate={{ x: 0 }}
            exit={{ x: direction === "rtl" ? 320 : -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`chatgpt-sidebar ${
              isSidebarCollapsed ? "collapsed" : ""
            }`}
          >
            <Sidebar
              isOpen={isSidebarOpen}
              isCollapsed={isSidebarCollapsed}
              onToggle={handleToggleSidebar}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
              chatHistory={chatHistory}
              favorites={favorites}
              onNewChat={handleNewChat}
              onClearHistory={() => {}} // clearHistory is no longer available
              onExportConversation={() => {}} // exportConversation is no longer available
              onLoadSession={handleLoadSession}
              onDeleteConversation={handleDeleteConversation}
              onSendSuggestedMessage={handleSendSuggestedMessage}
              currentSessionId={currentSessionId}
              user={{
                name: user.name,
                email: user.email,
              }}
              onOpenSettings={() => setShowSettings(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="chatgpt-main">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* خلفية متدرجة مشابهة للـ Welcome */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-950"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-transparent to-cyan-900/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(6,214,160,0.1),transparent_50%)]"></div>

          {/* شبكة هندسية */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)
              `,
                backgroundSize: "25px 25px",
              }}
            />
          </div>

          {/* المحتوى الرئيسي */}
          <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <motion.button
                onClick={handleToggleSidebar}
                className="group relative p-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm bg-gray-800/50 border border-gray-600/50 hover:border-emerald-500/50"
                title={isSidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-4 h-4 relative">
                    <motion.div
                      className="absolute top-0 left-0 w-1 h-1 bg-current rounded-sm"
                      animate={{
                        x: isSidebarOpen ? 8 : 0,
                        backgroundColor: isSidebarOpen
                          ? "#10b981"
                          : "currentColor",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute top-1.5 left-0 w-1 h-1 bg-current rounded-sm"
                      animate={{
                        x: isSidebarOpen ? 8 : 0,
                        backgroundColor: isSidebarOpen
                          ? "#10b981"
                          : "currentColor",
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-3 left-0 w-1 h-1 bg-current rounded-sm"
                      animate={{
                        x: isSidebarOpen ? 8 : 0,
                        backgroundColor: isSidebarOpen
                          ? "#10b981"
                          : "currentColor",
                      }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* تأثير التوهج عند الhover */}
                <div className="absolute inset-0 rounded-xl bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors duration-300" />
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              {/* Settings Button */}
              <motion.button
                className="group relative p-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm bg-gray-800/50 border border-gray-600/50 hover:border-emerald-500/50"
                title="الإعدادات"
                onClick={() => setShowSettings(true)}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                {/* تأثير التوهج عند الhover */}
                <div className="absolute inset-0 rounded-xl bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors duration-300" />
              </motion.button>

              {/* Share Button */}
              <motion.button
                className="group relative p-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm bg-gray-800/50 border border-gray-600/50 hover:border-emerald-500/50"
                title="مشاركة المحادثة"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </motion.svg>

                {/* تأثير التوهج عند الhover */}
                <div className="absolute inset-0 rounded-xl bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors duration-300" />
              </motion.button>

              {/* More Options Button */}
              <motion.button
                className="group relative p-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-300 backdrop-blur-sm bg-gray-800/50 border border-gray-600/50 hover:border-emerald-500/50"
                title="المزيد من الخيارات"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </motion.svg>

                {/* تأثير التوهج عند الhover */}
                <div className="absolute inset-0 rounded-xl bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors duration-300" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="chatgpt-messages">
          {messages.length === 0 ? (
            <Welcome onSendSuggestedMessage={handleSendSuggestedMessage} />
          ) : (
            <div className="space-y-0">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  content={message.content}
                  isUser={message.type === "user"}
                  isFavorite={message.isFavorite}
                  files={message.files}
                  onCopy={() => handleCopyMessage()}
                  onFavorite={() => handleToggleFavorite(message.id)}
                />
              ))}

              {isLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="scroll-indicator"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input Container */}
        {!showSettings && (
          <div className="chatgpt-input-container">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Loading is now handled by TypingIndicator in the messages */}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[10000] space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};
