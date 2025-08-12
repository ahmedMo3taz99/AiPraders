import { log } from '../config';
import { getApiUrl } from '../config/apiConfig';

// Auth APIs
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => {
    log('debug', 'Attempting to register user', { email: data.email });
    
    // Add status field to fix the database error
    const requestData = {
      ...data,
      status: true, // Use boolean for SQLite
      type: 'user'
    };
    
    const response = await fetch(getApiUrl('/api/auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    const result = await response.json();
    log('debug', 'Registration response', result);
    
    return result;
  },

  login: async (data: { email: string; password: string }) => {
    log('debug', 'Attempting to login user', { email: data.email });
    
    const response = await fetch(getApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    log('debug', 'Login response', result);
    
    return result;
  },

  googleLogin: async (data: { access_token: string }) => {
    log('debug', 'Attempting Google login');
    
    const response = await fetch(getApiUrl('/api/auth/google'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    log('debug', 'Google login response', result);
    
    return result;
  },

  logout: async (token: string) => {
    log('debug', 'Attempting to logout user');
    
    const response = await fetch(getApiUrl('/api/auth/logout'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Logout response', result);
    
    return result;
  },

  forgotPassword: async (data: { email: string }) => {
    log('debug', 'Attempting to send forgot password email', { email: data.email });
    
    const response = await fetch(getApiUrl('/api/auth/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    log('debug', 'Forgot password response', result);
    
    return result;
  },

  resetPassword: async (data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => {
    log('debug', 'Attempting to reset password', { email: data.email });
    
    const response = await fetch(getApiUrl('/api/auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    log('debug', 'Reset password response', result);
    
    return result;
  },
};

// User APIs
export const userAPI = {
  getProfile: async (token: string) => {
    log('debug', 'Fetching user profile');
    
    const response = await fetch(getApiUrl('/api/user/profile'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Get profile response', result);
    
    return result;
  },

  updateProfile: async (token: string, data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => {
    log('debug', 'Updating user profile', data);
    
    const response = await fetch(getApiUrl('/api/user/profile'), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    log('debug', 'Update profile response', result);
    
    return result;
  },

  updateAvatar: async (token: string, avatar: File) => {
    log('debug', 'Updating user avatar');
    
    const formData = new FormData();
    formData.append('avatar', avatar);

    const response = await fetch(getApiUrl('/api/user/avatar'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    log('debug', 'Update avatar response', result);
    
    return result;
  },
};

// ChatBot APIs
export const chatBotAPI = {
  sendMessage: async (token: string, data: {
    message: string;
    sessionId?: string;
  }) => {
    log('debug', 'Sending message to chatbot', { sessionId: data.sessionId });
    
    const response = await fetch(getApiUrl('/api/chatbot/send-message'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (response.status === 429) {
      throw new Error('Too Many Requests - يرجى الانتظار قليلاً قبل المحاولة مرة أخرى');
    }
    
    const result = await response.json();
    log('debug', 'Send message response', result);
    
    return result;
  },

  getHistory: async (token: string) => {
    log('debug', 'Fetching chat history');
    
    try {
      const url = getApiUrl('/api/chatbot/history');
      console.log('History URL:', url);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('History response status:', response.status);
      console.log('History response ok:', response.ok);
      console.log('History response headers:', response.headers);
      
      if (response.status === 429) {
        throw new Error('Too Many Requests - يرجى الانتظار قليلاً قبل المحاولة مرة أخرى');
      }
      
      if (!response.ok) {
        console.error('History response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('History error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      log('debug', 'Get history response', result);
      console.log('History result:', result);
      
      return result;
    } catch (error) {
      console.error('Error in getHistory:', error);
      throw error;
    }
  },

  getHistoryPaginated: async (token: string, page: number = 1, perPage: number = 10) => {
    log('debug', 'Fetching paginated chat history', { page, perPage });
    
    try {
      const url = getApiUrl(`/api/chatbot/history?page=${page}&per_page=${perPage}`);
      console.log('Paginated History URL:', url);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Page:', page);
      console.log('Per Page:', perPage);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Paginated History response status:', response.status);
      console.log('Paginated History response ok:', response.ok);
      
      if (!response.ok) {
        console.error('Paginated History response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Paginated History error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      log('debug', 'Get paginated history response', result);
      console.log('Paginated History result:', result);
      
      return result;
    } catch (error) {
      console.error('Error in getHistoryPaginated:', error);
      throw error;
    }
  },

  searchConversations: async (token: string, query: string, page: number = 1, perPage: number = 10) => {
    log('debug', 'Searching conversations', { query, page, perPage });
    
    try {
      const url = getApiUrl(`/api/chatbot/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
      console.log('Search URL:', url);
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Query:', query);
      console.log('Page:', page);
      console.log('Per Page:', perPage);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Search response status:', response.status);
      console.log('Search response ok:', response.ok);
      
      if (!response.ok) {
        console.error('Search response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Search error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      log('debug', 'Search response', result);
      console.log('Search result:', result);
      
      return result;
    } catch (error) {
      console.error('Error in searchConversations:', error);
      throw error;
    }
  },

  newSession: async (token: string) => {
    log('debug', 'Creating new chat session');
    
    const response = await fetch(getApiUrl('/api/chatbot/new-session'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'New session response', result);
    
    return result;
  },

  getSession: async (token: string, sessionId: string) => {
    log('debug', 'Fetching chat session', { sessionId });
    
    try {
      const url = getApiUrl(`/api/chatbot/session/${sessionId}`);
      console.log('Get session URL:', url);
      console.log('Session ID:', sessionId);
      console.log('Token present:', !!token);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Get session response status:', response.status);
      console.log('Get session response ok:', response.ok);
      console.log('Get session response headers:', response.headers);
      
      if (response.status === 429) {
        throw new Error('Too Many Requests - يرجى الانتظار قليلاً قبل المحاولة مرة أخرى');
      }
      
      if (!response.ok) {
        console.error('Get session response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Get session error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      log('debug', 'Get session response', result);
      console.log('Get session result:', result);
      
      return result;
    } catch (error) {
      console.error('Error in getSession:', error);
      throw error;
    }
  },

  deleteSession: async (token: string, sessionId: string) => {
    log('debug', 'Deleting chat session', { sessionId });
    
    const response = await fetch(getApiUrl(`/api/chatbot/session/${sessionId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Delete session response', result);
    
    return result;
  },

  getFavorites: async (token: string) => {
    log('debug', 'Fetching favorite messages');
    
    const response = await fetch(getApiUrl('/api/chatbot/favorites'), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Get favorites response', result);
    
    return result;
  },

  toggleFavorite: async (token: string, messageId: string) => {
    log('debug', 'Toggling favorite message', { messageId });
    
    const response = await fetch(getApiUrl(`/api/chatbot/favorites/${messageId}`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Toggle favorite response', result);
    
    return result;
  },

  removeFavorite: async (token: string, messageId: string) => {
    log('debug', 'Removing favorite message', { messageId });
    
    const response = await fetch(getApiUrl(`/api/chatbot/favorites/${messageId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Remove favorite response', result);
    
    return result;
  },

  exportConversation: async (token: string, sessionId: string) => {
    log('debug', 'Exporting conversation', { sessionId });
    
    const response = await fetch(getApiUrl('/api/chatbot/export'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    
    const result = await response.blob();
    log('debug', 'Export conversation response', { size: result.size });
    
    return result;
  },

  clearHistory: async (token: string) => {
    log('debug', 'Clearing chat history');
    
    const response = await fetch(getApiUrl('/api/chatbot/clear-history'), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Clear history response', result);
    
    return result;
  },

  sendMessageWithFiles: async (token: string, data: {
    message: string;
    sessionId?: string;
    files: File[];
  }) => {
    log('debug', 'Sending message with files to chatbot', { 
      sessionId: data.sessionId, 
      fileCount: data.files.length 
    });
    
    const formData = new FormData();
    formData.append('message', data.message);
    if (data.sessionId) {
      formData.append('sessionId', data.sessionId);
    }
    
    data.files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    const response = await fetch(getApiUrl('/api/chatbot/send-message-with-files'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    log('debug', 'Send message with files response', result);
    
    return result;
  },

  deleteConversation: async (token: string, sessionId: string) => {
    log('debug', 'Deleting conversation', { sessionId });
    
    const response = await fetch(getApiUrl(`/api/chatbot/conversation/${sessionId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    log('debug', 'Delete conversation response', result);
    
    return result;
  },
};

// Legacy API service for backward compatibility
export const apiService = {
  sendMessage: async (data: { message: string; sessionId?: string }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.sendMessage(token, data);
  },

  getChatHistory: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.getHistory(token);
  },

  getFavorites: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.getFavorites(token);
  },

  toggleFavorite: async (messageId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.toggleFavorite(token, messageId);
  },

  newSession: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.newSession(token);
  },

  exportConversation: async (sessionId: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.exportConversation(token, sessionId);
  },

  clearHistory: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return chatBotAPI.clearHistory(token);
  },
}; 