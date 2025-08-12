import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Settings,
  User,
  LogOut,
  Trash2,
  Download,
  History,
  Play,
  Grid3X3,
  MessageSquare,
  HelpCircle,
  FileText,
  Keyboard,
  Search,
  Sparkles,
} from "lucide-react";
import { ChatHistoryItem, FavoriteMessage } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { InfiniteScroll } from "./InfiniteScroll";
import logo from "../assets/logo.png";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onToggle: () => void;
  onToggleCollapse?: () => void;
  chatHistory: ChatHistoryItem[];
  favorites: FavoriteMessage[];
  onNewChat: () => void;
  onClearHistory: () => void;
  onExportConversation: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteConversation: (sessionId: string) => void;
  onSendSuggestedMessage: (message: string) => void;
  currentSessionId: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onOpenSettings: () => void;
}

// مكون الخلفية المتحركة للسايدبار
const SidebarBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `sidebar-particle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950"></div>

      {/* شبكة هندسية */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* جزيئات متحركة */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-emerald-400/40 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.8, 0.2],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// مكون الشعار المحسن
const ModernLogo = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b border-emerald-500/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="relative w-10 h-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* خلفية متوهجة */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-green-400/20 to-emerald-600/30 rounded-xl blur-lg"></div>

          {/* الحاوي الرئيسي */}
          <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-700 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center border border-emerald-400/30">
            <img src={logo} alt="Pro Traders Group" className="w-6 h-6" />

            {/* إضاءة علوية */}
            <div className="absolute top-1 left-1 w-3 h-3 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
          </div>
        </motion.div>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-bold text-white text-lg bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Pro Traders
            </span>
            <div className="text-xs text-emerald-400 font-medium">Group AI</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// زر محسن
const ModernButton = ({
  onClick,
  children,
  variant = "primary",
  isCollapsed = false,
  className = "",
  ...props
}: any) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl px-4 py-3 font-medium transition-all duration-300
        flex items-center gap-3 w-full
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
    >
      {/* خلفية متوهجة عند الهوفر */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 flex items-center gap-3 w-full">
        {children}
      </div>
    </motion.button>
  );
};

// عنصر المحادثة المحسن
const ModernChatItem = ({
  chat,
  index,
  isActive,
  onChatClick,
  onDeleteChat,
  hoveredChat,
  setHoveredChat,
  uniqueKey,
}: any) => {
  return (
    <motion.div
      key={uniqueKey}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHoveredChat(chat.sessionId)}
      onMouseLeave={() => setHoveredChat(null)}
      className={`
        relative group cursor-pointer rounded-xl p-3 transition-all duration-300
        ${
          isActive
            ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
            : "hover:bg-gray-800/30 border border-transparent hover:border-emerald-500/20"
        }
      `}
      onClick={() => onChatClick(chat.sessionId)}
      whileHover={{ x: 4 }}
    >
      {/* خلفية متوهجة */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-emerald-600/10 rounded-xl blur-sm"></div>
      )}

      <div className="relative z-10 flex items-center gap-3">
        <motion.div
          className={`
            p-2 rounded-lg transition-all duration-300
            ${
              isActive
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-gray-700/50 text-gray-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400"
            }
          `}
          whileHover={{ scale: 1.1 }}
        >
          <MessageSquare size={16} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <span
            className={`
            block truncate font-medium transition-colors duration-300
            ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}
          `}
          >
            {chat.firstMessage}
          </span>

          {/* خط التمييز السفلي */}
          <motion.div
            className="h-px bg-gradient-to-r from-emerald-500 to-green-400 mt-1"
            initial={{ width: 0 }}
            animate={{ width: isActive ? "100%" : "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* زر الحذف */}
        <AnimatePresence mode="wait">
          {hoveredChat === chat.sessionId && (
            <motion.button
              key={`delete-btn-${chat.sessionId}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => onDeleteChat(e, chat.sessionId)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  onToggle,
  isCollapsed = false,
  chatHistory,
  onNewChat,
  onLoadSession,
  onDeleteConversation,
  currentSessionId,
  user,
  onOpenSettings,
}) => {
  const { t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [displayedChats, setDisplayedChats] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatHistoryItem[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  const itemsPerPage = 10;

  // إنشاء معرف فريد للمكون
  const componentId = useMemo(
    () => `sidebar-${Date.now()}-${Math.random()}`,
    []
  );

  // إزالة التكرارات من المحادثات
  const removeDuplicateChats = (chats: ChatHistoryItem[]) => {
    const seen = new Set<string>();
    return chats.filter((chat) => {
      if (seen.has(chat.sessionId)) {
        return false;
      }
      seen.add(chat.sessionId);
      return true;
    });
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
        setShowHelpMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // تحديث البحث عند تغيير البيانات
  useEffect(() => {
    if (searchQuery.trim() && !isSearching && chatHistory.length > 0) {
      const timeoutId = setTimeout(() => {
        const uniqueChats = removeDuplicateChats(chatHistory);
        const results = uniqueChats.filter((chat) =>
          chat.firstMessage.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(removeDuplicateChats(results));
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [chatHistory.length, searchQuery, isSearching]);

  // تحديث المحادثات المعروضة عند تغيير chatHistory
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const uniqueChats = removeDuplicateChats(chatHistory);

      // إذا كانت المحادثات المعروضة فارغة، أو إذا تغير العدد الكلي
      if (displayedChats.length === 0 || uniqueChats.length !== totalItems) {
        const initialChats = uniqueChats.slice(0, itemsPerPage);
        setDisplayedChats(initialChats);
        setTotalPages(Math.ceil(uniqueChats.length / itemsPerPage));
        setTotalItems(uniqueChats.length);
        setHasMore(uniqueChats.length > itemsPerPage);
        setCurrentPage(1);
      }
    }
  }, [chatHistory]);

  // إنشاء المحادثات مع مفاتيح فريدة
  const uniqueDisplayedChats = useMemo(() => {
    const unique = removeDuplicateChats(displayedChats);
    return unique;
  }, [displayedChats]);

  const uniqueSearchResults = useMemo(() => {
    const unique = removeDuplicateChats(searchResults);
    return unique;
  }, [searchResults]);

  const handleLogout = async () => {
    await logout();
  };

  const handleChatClick = async (sessionId: string) => {
    setLoading(true);
    try {
      await onLoadSession(sessionId);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
      onDeleteConversation(sessionId);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const uniqueChats = removeDuplicateChats(chatHistory);
      const currentLength = displayedChats.length;
      const newChats = uniqueChats.slice(
        currentLength,
        currentLength + itemsPerPage
      );

      if (newChats.length > 0) {
        const uniqueNewChats = removeDuplicateChats(newChats);
        setDisplayedChats((prev) => {
          const combined = [...prev, ...uniqueNewChats];
          return removeDuplicateChats(combined);
        });
        setCurrentPage(currentPage + 1);
        setHasMore(currentLength + uniqueNewChats.length < uniqueChats.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more chats:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const uniqueChats = removeDuplicateChats(chatHistory);
      const results = uniqueChats.filter((chat) =>
        chat.firstMessage.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(removeDuplicateChats(results));
      setIsSearching(false);
    }, 300);
  };

  const formatUserName = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0];
    }

    const firstName = names[0];
    const secondName = names[1];
    const secondNamePart = secondName.substring(0, 2);

    return `${firstName} ${secondNamePart}...`;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950/50 backdrop-blur-xl border-r border-emerald-500/20">
      {/* خلفية متحركة */}
      <SidebarBackground />

      <div className="relative z-10 h-full flex flex-col">
        {/* الشعار المحسن */}
        <ModernLogo isCollapsed={isCollapsed} />

        {/* زر المحادثة الجديدة */}
        <div className="p-4">
          <ModernButton
            onClick={onNewChat}
            variant="primary"
            isCollapsed={isCollapsed}
            transition={{ delay: 0.1 }}
          >
            <Plus size={isCollapsed ? 20 : 16} />
            {!isCollapsed && (
              <span className="flex items-center gap-2">
                <Sparkles size={14} />
                {t.sidebar.newChat}
              </span>
            )}
          </ModernButton>
        </div>

        {/* البحث المحسن */}
        {!isCollapsed && (
          <motion.div
            className="px-4 pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl px-10 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm"
              />
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 opacity-0 pointer-events-none"
                whileFocus={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* قائمة التنقل */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {/* عناصر التنقل */}
          <motion.div
            className="space-y-1 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ModernButton variant="ghost" isCollapsed={isCollapsed}>
              <History size={isCollapsed ? 20 : 16} />
              {!isCollapsed && <span>{t.sidebar.library}</span>}
            </ModernButton>

            <ModernButton variant="ghost" isCollapsed={isCollapsed}>
              <Play size={isCollapsed ? 20 : 16} />
              {!isCollapsed && <span>Sora</span>}
            </ModernButton>

            <ModernButton variant="ghost" isCollapsed={isCollapsed}>
              <Grid3X3 size={isCollapsed ? 20 : 16} />
              {!isCollapsed && <span>{t.sidebar.gpts}</span>}
            </ModernButton>

            <ModernButton variant="secondary" isCollapsed={isCollapsed}>
              <User size={isCollapsed ? 20 : 16} />
              {!isCollapsed && <span>{t.sidebar.askToby}</span>}
            </ModernButton>
          </motion.div>

          {/* تاريخ المحادثات */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4 px-2">
                <MessageSquare size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  {t.sidebar.conversations}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
              </div>

              {searchQuery.trim() ? (
                // نتائج البحث
                <div className="space-y-2">
                  {isSearching ? (
                    <motion.div
                      key={`search-loading-${componentId}`}
                      className="flex items-center justify-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-3 text-emerald-400">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Search size={20} />
                        </motion.div>
                        <span className="text-sm">جاري البحث...</span>
                      </div>
                    </motion.div>
                  ) : uniqueSearchResults.length > 0 ? (
                    <div
                      key={`search-results-container-${componentId}`}
                      className="space-y-2"
                    >
                      {uniqueSearchResults.map((chat, index) => (
                        <ModernChatItem
                          key={`search-result-${chat.sessionId}-${index}`}
                          chat={chat}
                          index={index}
                          isActive={chat.sessionId === currentSessionId}
                          onChatClick={handleChatClick}
                          onDeleteChat={handleDeleteChat}
                          hoveredChat={hoveredChat}
                          setHoveredChat={setHoveredChat}
                          uniqueKey={`search-result-${chat.sessionId}-${index}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      key={`no-search-results-${componentId}`}
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <MessageSquare
                        size={32}
                        className="mx-auto mb-3 text-gray-500"
                      />
                      <p className="text-sm text-gray-400">
                        لا توجد نتائج للبحث
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                // قائمة المحادثات العادية
                <div key={`chat-list-container-${componentId}`}>
                  <InfiniteScroll
                    hasMore={hasMore}
                    loading={loading}
                    onLoadMore={handleLoadMore}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                  >
                    <div className="space-y-2">
                      {uniqueDisplayedChats.length > 0 ? (
                        <div
                          key={`chats-container-${componentId}`}
                          className="space-y-2"
                        >
                          {uniqueDisplayedChats.map((chat, index) => (
                            <ModernChatItem
                              key={`chat-item-${chat.sessionId}-${index}`}
                              chat={chat}
                              index={index}
                              isActive={chat.sessionId === currentSessionId}
                              onChatClick={handleChatClick}
                              onDeleteChat={handleDeleteChat}
                              hoveredChat={hoveredChat}
                              setHoveredChat={setHoveredChat}
                              uniqueKey={`chat-item-${chat.sessionId}-${index}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          key={`no-chats-${componentId}`}
                          className="text-center py-8"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <MessageSquare
                            size={32}
                            className="mx-auto mb-3 text-gray-500"
                          />
                          <p className="text-sm text-gray-400">
                            {t.sidebar.noConversations}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </InfiniteScroll>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ملف المستخدم المحسن */}
        {user && (
          <motion.div
            className="p-4 border-t border-emerald-500/20 backdrop-blur-sm"
            ref={userMenuRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className={`
                flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-emerald-500/10 hover:to-emerald-600/10
                border border-gray-600/50 hover:border-emerald-500/30
                ${isCollapsed ? "justify-center" : ""}
              `}
              onClick={() => setShowUserMenu(!showUserMenu)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>

                {/* نقطة الحالة */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">
                    {formatUserName(user.name)}
                  </div>
                  <div className="text-xs text-emerald-400">
                    {t.sidebar.free}
                  </div>
                </div>
              )}

              {!isCollapsed && (
                <motion.div
                  animate={{ rotate: showUserMenu ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Settings size={16} className="text-gray-400" />
                </motion.div>
              )}
            </motion.div>

            {/* قائمة المستخدم */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  key={`user-menu-${componentId}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden"
                >
                  {/* معلومات المستخدم */}
                  <div className="p-4 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <User size={24} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {user.name}
                        </div>
                        <div className="text-sm text-emerald-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* عناصر القائمة */}
                  <div className="p-2 space-y-1">
                    <motion.button
                      key={`upgrade-${componentId}`}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-1 bg-emerald-500/20 rounded-lg">
                        <Plus size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm">{t.sidebar.upgradePlan}</span>
                    </motion.button>

                    <motion.button
                      key={`customize-${componentId}`}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-1 bg-emerald-500/20 rounded-lg">
                        <Settings size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm">{t.sidebar.customizeToby}</span>
                    </motion.button>

                    <motion.button
                      key={`settings-${componentId}`}
                      onClick={onOpenSettings}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-1 bg-emerald-500/20 rounded-lg">
                        <Settings size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm">{t.sidebar.settings}</span>
                    </motion.button>

                    <motion.button
                      key={`help-${componentId}`}
                      onClick={() => setShowHelpMenu(!showHelpMenu)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-1 bg-emerald-500/20 rounded-lg">
                        <HelpCircle size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-sm">{t.sidebar.help}</span>
                      <motion.div
                        animate={{ rotate: showHelpMenu ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-auto"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="currentColor"
                        >
                          <path
                            d="M4 6l4 0"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6 4l0 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    </motion.button>

                    {/* قائمة المساعدة الفرعية */}
                    <AnimatePresence>
                      {showHelpMenu && (
                        <motion.div
                          key={`help-submenu-${componentId}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-6 space-y-1 border-l-2 border-emerald-500/20 pl-3"
                        >
                          <motion.button
                            key={`help-center-${componentId}`}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                            whileHover={{ x: 2 }}
                          >
                            <HelpCircle size={12} />
                            <span>{t.sidebar.helpCenter}</span>
                          </motion.button>

                          <motion.button
                            key={`release-notes-${componentId}`}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                            whileHover={{ x: 2 }}
                          >
                            <FileText size={12} />
                            <span>{t.sidebar.releaseNotes}</span>
                          </motion.button>

                          <motion.button
                            key={`terms-${componentId}`}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                            whileHover={{ x: 2 }}
                          >
                            <FileText size={12} />
                            <span>{t.sidebar.termsPolicies}</span>
                          </motion.button>

                          <motion.button
                            key={`download-${componentId}`}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                            whileHover={{ x: 2 }}
                          >
                            <Download size={12} />
                            <span>{t.sidebar.downloadApps}</span>
                          </motion.button>

                          <motion.button
                            key={`keyboard-${componentId}`}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                            whileHover={{ x: 2 }}
                          >
                            <Keyboard size={12} />
                            <span>{t.sidebar.keyboardShortcuts}</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* خط فاصل */}
                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent my-2"></div>

                    <motion.button
                      key={`logout-${componentId}`}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-1 bg-red-500/20 rounded-lg">
                        <LogOut size={14} className="text-red-400" />
                      </div>
                      <span className="text-sm">{t.sidebar.logout}</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* زر الإغلاق للموبايل */}
        <motion.button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};
