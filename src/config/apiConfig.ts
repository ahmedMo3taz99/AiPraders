// Centralized API Configuration for Pro Traders Group
// This file manages all API URLs and settings in one place

export interface ApiEnvironment {
  name: string;
  baseUrl: string;
  timeout: number;
  description: string;
}

export interface ApiEndpoints {
  // Authentication endpoints
  auth: {
    register: string;
    login: string;
    googleLogin: string;
    logout: string;
    forgotPassword: string;
    resetPassword: string;
    check: string;
  };
  
  // User management endpoints
  user: {
    profile: string;
    avatar: string;
  };
  
  // Chatbot endpoints
  chatbot: {
    sendMessage: string;
    sendMessageWithFiles: string;
    history: string;
    search: string;
    newSession: string;
    session: string;
    favorites: string;
    export: string;
    clearHistory: string;
    conversation: string;
    status: string;
  };
  
  // Health and status endpoints
  health: {
    check: string;
  };
}

// Environment configurations
export const API_ENVIRONMENTS: Record<string, ApiEnvironment> = {
  development: {
    name: 'Development',
    baseUrl: 'http://localhost:8000',
    timeout: 30000,
    description: 'Local development environment'
  },
  test: {
    name: 'Test',
    baseUrl: 'https://test.pro-traders-group.com',
    timeout: 30000,
    description: 'Pro Traders Group test environment'
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://staging.pro-traders-group.com',
    timeout: 30000,
    description: 'Pro Traders Group staging environment'
  },
  production: {
    name: 'Production',
    baseUrl: 'https://pro-traders-group.com',
    timeout: 30000,
    description: 'Pro Traders Group production environment'
  },
  mock: {
    name: 'Mock API',
    baseUrl: 'mock://localhost',
    timeout: 30000,
    description: 'Mock API for testing (when real API has issues)'
  }
};

// Get current environment from environment variable or default to test
export const getCurrentEnvironment = (): string => {
  // Check if VITE_API_BASE_URL is set - this takes priority
  const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (customBaseUrl) {
    console.log('✅ Custom base URL detected, ignoring localStorage settings');
    return 'custom';
  }
  
  // Check localStorage for runtime switching (only if no custom base URL)
  const stored = localStorage.getItem('preferred_api_environment');
  if (stored && API_ENVIRONMENTS[stored]) {
    return stored;
  }
  
  // Fall back to environment variable or test
  const env = import.meta.env.VITE_API_ENVIRONMENT || 'test';
  return API_ENVIRONMENTS[env] ? env : 'test';
};

// Get current environment configuration
export const getCurrentApiConfig = (): ApiEnvironment => {
  // Check if VITE_API_BASE_URL is set in environment variables
  const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log('🔍 Debug - Environment variables:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_API_ENVIRONMENT: import.meta.env.VITE_API_ENVIRONMENT,
    customBaseUrl: customBaseUrl,
    hasCustomBaseUrl: !!customBaseUrl,
    customBaseUrlLength: customBaseUrl ? customBaseUrl.length : 0,
    customBaseUrlTrimmed: customBaseUrl ? customBaseUrl.trim() : '',
    customBaseUrlIsEmpty: customBaseUrl ? customBaseUrl.trim() === '' : true,
    customBaseUrlType: typeof customBaseUrl,
    customBaseUrlUndefined: customBaseUrl === undefined,
    customBaseUrlNull: customBaseUrl === null,
    customBaseUrlString: String(customBaseUrl),
    customBaseUrlTruthy: !!customBaseUrl,
    customBaseUrlFalsy: !customBaseUrl,
    customBaseUrlEmptyString: customBaseUrl === '',
    customBaseUrlWhitespace: customBaseUrl === ' ',
    customBaseUrlNewline: customBaseUrl === '\n'
  });
  
  if (customBaseUrl && customBaseUrl.trim() !== '') {
    const trimmedUrl = customBaseUrl.trim();
    console.log('✅ Using custom API base URL from environment variable:', trimmedUrl);
    return {
      name: 'Custom',
      baseUrl: trimmedUrl,
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
      description: 'Custom API base URL from environment variable'
    };
  }
  
  // Fall back to environment-based configuration
  const currentEnv = getCurrentEnvironment();
  console.log('⚠️ No custom base URL found, using environment:', currentEnv);
  return API_ENVIRONMENTS[currentEnv];
};

// Generate API endpoints based on current environment
export const generateApiEndpoints = (baseUrl: string): ApiEndpoints => {
  return {
    auth: {
      register: `${baseUrl}/api/auth/register`,
      login: `${baseUrl}/api/auth/login`,
      googleLogin: `${baseUrl}/api/auth/google`,
      logout: `${baseUrl}/api/auth/logout`,
      forgotPassword: `${baseUrl}/api/auth/forgot-password`,
      resetPassword: `${baseUrl}/api/auth/reset-password`,
      check: `${baseUrl}/api/auth/check`,
    },
    user: {
      profile: `${baseUrl}/api/user/profile`,
      avatar: `${baseUrl}/api/user/avatar`,
    },
    chatbot: {
      sendMessage: `${baseUrl}/api/chatbot/send-message`,
      sendMessageWithFiles: `${baseUrl}/api/chatbot/send-message-with-files`,
      history: `${baseUrl}/api/chatbot/history`,
      search: `${baseUrl}/api/chatbot/search`,
      newSession: `${baseUrl}/api/chatbot/new-session`,
      session: `${baseUrl}/api/chatbot/session`,
      favorites: `${baseUrl}/api/chatbot/favorites`,
      export: `${baseUrl}/api/chatbot/export`,
      clearHistory: `${baseUrl}/api/chatbot/clear-history`,
      conversation: `${baseUrl}/api/chatbot/conversation`,
      status: `${baseUrl}/api/chatbot/status`,
    },
    health: {
      check: `${baseUrl}/api/health`,
    },
  };
};

// Current API configuration
export const apiConfig = {
  environment: getCurrentApiConfig(),
  endpoints: generateApiEndpoints(getCurrentApiConfig().baseUrl),
  timeout: getCurrentApiConfig().timeout,
};

// Log the final configuration for debugging
if (typeof window !== 'undefined') {
  // Clear localStorage if custom base URL is set
  const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (customBaseUrl && customBaseUrl.trim() !== '') {
    localStorage.removeItem('preferred_api_environment');
    console.log('🧹 Cleared localStorage settings - using custom base URL:', customBaseUrl.trim());
  }
  
  console.log('🚀 Final API Configuration:', {
    environment: apiConfig.environment.name,
    baseUrl: apiConfig.environment.baseUrl,
    timeout: apiConfig.timeout,
    description: apiConfig.environment.description,
    customBaseUrl: customBaseUrl,
    isCustom: apiConfig.environment.name === 'Custom'
  });
}

// Helper functions
export const getApiUrl = (endpoint: string): string => {
  return `${apiConfig.environment.baseUrl}${endpoint}`;
};

export const getEndpoint = (path: keyof ApiEndpoints, subPath?: string): string => {
  const endpointGroup = apiConfig.endpoints[path];
  if (subPath) {
    return endpointGroup[subPath as keyof typeof endpointGroup] || '';
  }
  return '';
};

// Export for backward compatibility
export const config = {
  api: {
    baseUrl: apiConfig.environment.baseUrl,
    timeout: apiConfig.timeout,
  },
  // ... other config properties
};

// Log current configuration
console.log('🔧 API Configuration Loaded:', {
  environment: apiConfig.environment.name,
  baseUrl: apiConfig.environment.baseUrl,
  description: apiConfig.environment.description,
  envVar: import.meta.env.VITE_API_ENVIRONMENT,
  currentEnv: getCurrentEnvironment(),
  customBaseUrl: import.meta.env.VITE_API_BASE_URL,
  isCustom: apiConfig.environment.name === 'Custom'
});

export default apiConfig; 