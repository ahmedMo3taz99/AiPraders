import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatHistoryItem, FavoriteMessage } from '../types';
import { chatBotAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteMessage[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const loadChatHistory = useCallback(async () => {
    if (!token) return;
    
    try {
      console.log('Loading chat history...');
      const response = await chatBotAPI.getHistory(token);
      console.log('Chat history response:', response);
      
      if (response.success && response.data) {
        // تحويل البيانات إلى التنسيق المطلوب
        const formattedHistory = response.data.map((chat: any) => ({
          sessionId: chat.session_id || chat.sessionId,
          firstMessage: chat.first_message || chat.firstMessage || 'محادثة جديدة',
          createdAt: new Date(chat.created_at || chat.createdAt),
          messageCount: chat.message_count || chat.messageCount || 0,
        }));
        
        console.log('Formatted chat history:', formattedHistory);
        setChatHistory(formattedHistory);
      } else {
        console.error('Error loading chat history:', response.message);
        showToast('حدث خطأ في تحميل المحادثات', 'error');
      }
    } catch (error: any) {
      console.error('Error loading chat history:', error);
      
      let errorMessage = 'حدث خطأ في تحميل المحادثات';
      
      if (error.message) {
        if (error.message.includes('Too Many Requests') || error.message.includes('429')) {
          errorMessage = 'تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.';
        }
      }
      
      showToast(errorMessage, 'error');
    }
  }, [token, showToast]);

  const loadFavorites = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await chatBotAPI.getFavorites(token);
      if (response.success) {
        setFavorites(response.data);
      } else {
        console.error('Error loading favorites:', response.message);
        showToast('حدث خطأ في تحميل المفضلة', 'error');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      showToast('حدث خطأ في تحميل المفضلة', 'error');
    }
  }, [token, showToast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message:', { message: content.trim(), sessionId: currentSessionId });
      
      const response = await chatBotAPI.sendMessage(token, {
        message: content.trim(),
        sessionId: currentSessionId,
      });

      console.log('Response received:', response);

      if (response.success && response.data) {
        const botMessage: Message = {
          id: response.data.message.id.toString(),
          content: response.data.message.content,
          type: 'bot',
          timestamp: new Date(response.data.message.timestamp),
          isFavorite: false,
        };

        setMessages(prev => [...prev.slice(0, -1), userMessage, botMessage]);
        
        if (response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
        }
        
        // Refresh chat history
        loadChatHistory();
      } else {
        console.error('Error sending message:', response.message);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: response.message || 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.',
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev.slice(0, -1), userMessage, errorMessage]);
        showToast(response.message || 'حدث خطأ في إرسال الرسالة', 'error');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      let errorContent = 'عذراً، حدث خطأ في الخدمة. يرجى المحاولة مرة أخرى.';
      
      if (error.message) {
        if (error.message.includes('Too Many Requests') || error.message.includes('429')) {
          errorContent = 'تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.';
        } else if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorContent = 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorContent = 'انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.';
        } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
          errorContent = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
        }
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: errorContent,
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(0, -1), userMessage, errorMessage]);
      showToast(errorContent, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, loadChatHistory, showToast, token]);

  const sendMessageWithFiles = useCallback(async (content: string, files: File[]) => {
    if ((!content.trim() && files.length === 0) || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim() || `تم رفع ${files.length} ملف(ات)`,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log('Sending message with files:', { message: content.trim(), files: files.length });
      
      const response = await chatBotAPI.sendMessageWithFiles(token, {
        message: content.trim(),
        sessionId: currentSessionId,
        files: files,
      });

      console.log('Response received:', response);

      if (response.success && response.data) {
        const botMessage: Message = {
          id: response.data.message.id.toString(),
          content: response.data.message.content,
          type: 'bot',
          timestamp: new Date(response.data.message.timestamp),
          isFavorite: false,
        };

        // Update user message with file information if available
        const updatedUserMessage = {
          ...userMessage,
          id: response.data.userMessage.id.toString(),
          content: response.data.userMessage.content,
          timestamp: new Date(response.data.userMessage.timestamp),
          files: response.data.userMessage.files || null,
        };

        setMessages(prev => [...prev.slice(0, -1), updatedUserMessage, botMessage]);
        
        if (response.data.sessionId) {
          setCurrentSessionId(response.data.sessionId);
        }
        
        // Refresh chat history
        loadChatHistory();
      } else {
        console.error('Error sending message with files:', response.message);
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: response.message || 'عذراً، حدث خطأ في معالجة الملفات. يرجى المحاولة مرة أخرى.',
          type: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev.slice(0, -1), userMessage, errorMessage]);
        showToast(response.message || 'حدث خطأ في إرسال الرسالة', 'error');
      }
    } catch (error: any) {
      console.error('Error sending message with files:', error);
      
      let errorContent = 'عذراً، حدث خطأ في معالجة الملفات. يرجى المحاولة مرة أخرى.';
      
      if (error.message) {
        if (error.message.includes('Network') || error.message.includes('fetch')) {
          errorContent = 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorContent = 'انتهت صلاحية الجلسة. يرجى إعادة تسجيل الدخول.';
        } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
          errorContent = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
        } else if (error.message.includes('413') || error.message.includes('Payload Too Large')) {
          errorContent = 'حجم الملف كبير جداً. الحد الأقصى 10MB لكل ملف.';
        } else if (error.message.includes('415') || error.message.includes('Unsupported Media Type')) {
          errorContent = 'نوع الملف غير مدعوم. الملفات المدعومة: صور، PDF، نصوص، مستندات Word.';
        }
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: errorContent,
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev.slice(0, -1), userMessage, errorMessage]);
      showToast(errorContent, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, loadChatHistory, showToast, token]);

  const toggleFavorite = useCallback(async (messageId: string) => {
    if (!token) return;
    
    try {
      const response = await chatBotAPI.toggleFavorite(token, messageId);
      if (response.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isFavorite: response.data.isFavorite }
              : msg
          )
        );
        
        if (response.data.isFavorite) {
          loadFavorites();
          showToast('تم إضافة الرسالة للمفضلة', 'success');
        } else {
          showToast('تم إزالة الرسالة من المفضلة', 'info');
        }
      } else {
        console.error('Error toggling favorite:', response.message);
        showToast('حدث خطأ في تحديث المفضلة', 'error');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('حدث خطأ في تحديث المفضلة', 'error');
    }
  }, [loadFavorites, showToast, token]);

  const newSession = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await chatBotAPI.newSession(token);
      if (response.success) {
        setMessages([]);
        setCurrentSessionId(response.data.sessionId);
        loadChatHistory();
        showToast('تم إنشاء محادثة جديدة', 'success');
      } else {
        console.error('Error creating new session:', response.message);
        showToast('حدث خطأ في إنشاء المحادثة', 'error');
      }
    } catch (error) {
      console.error('Error creating new session:', error);
      showToast('حدث خطأ في إنشاء المحادثة', 'error');
    }
  }, [loadChatHistory, showToast, token]);

  const deleteConversation = useCallback(async (sessionId: string) => {
    if (!token) return;
    
    try {
      const response = await chatBotAPI.deleteConversation(token, sessionId);
      if (response.success) {
        if (sessionId === currentSessionId) {
          setMessages([]);
          setCurrentSessionId('');
        }
        loadChatHistory();
        showToast('تم حذف المحادثة', 'success');
      } else {
        console.error('Error deleting conversation:', response.message);
        showToast('حدث خطأ في حذف المحادثة', 'error');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      showToast('حدث خطأ في حذف المحادثة', 'error');
    }
  }, [currentSessionId, loadChatHistory, showToast, token]);

  const loadSession = useCallback(async (sessionId: string) => {
    if (!token) return;
    
    try {
      console.log('Loading session:', sessionId);
      console.log('Token present:', !!token);
      
      const response = await chatBotAPI.getSession(token, sessionId);
      console.log('Session response:', response);
      console.log('Response success:', response.success);
      console.log('Response data:', response.data);
      
      if (response.success && response.data) {
        console.log('Response data:', response.data);
        
        // البيانات تأتي مباشرة كـ array من الرسائل
        const messages = Array.isArray(response.data) ? response.data : response.data.messages || [];
        console.log('Messages array:', messages);
        
        // تحويل البيانات إلى التنسيق المطلوب
        const formattedMessages = messages.map((msg: any, index: number) => {
          console.log(`Processing message ${index}:`, msg);
          
          const formattedMessage = {
            id: msg.id?.toString() || `msg-${index}`,
            content: msg.content || msg.message || 'رسالة فارغة',
            type: msg.type === 'user' ? 'user' : 'bot',
            timestamp: new Date(msg.timestamp || msg.created_at || Date.now()),
            isFavorite: msg.isFavorite || msg.is_favorite || false,
            files: msg.files || null,
          };
          
          console.log(`Formatted message ${index}:`, formattedMessage);
          return formattedMessage;
        });
        
        console.log('All formatted messages:', formattedMessages);
        setMessages(formattedMessages);
        setCurrentSessionId(sessionId);
        showToast('تم تحميل المحادثة', 'success');
      } else {
        console.error('Error loading session:', response.message);
        console.error('Response not successful or no data');
        showToast('حدث خطأ في تحميل المحادثة', 'error');
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      console.error('Error details:', {
        message: error?.message || 'Unknown error',
        stack: error?.stack || 'No stack trace',
        name: error?.name || 'Unknown error type'
      });
      showToast('حدث خطأ في تحميل المحادثة', 'error');
    }
  }, [showToast, token]);

  // Load initial data
  useEffect(() => {
    if (token) {
      loadChatHistory();
      loadFavorites();
    }
  }, [token, loadChatHistory, loadFavorites]);

  return {
    messages,
    isLoading,
    chatHistory,
    favorites,
    currentSessionId,
    toasts,
    messagesEndRef,
    sendMessage,
    sendMessageWithFiles,
    toggleFavorite,
    newSession,
    deleteConversation,
    loadSession,
    showToast,
    removeToast,
  };
}; 