// Configuration file for environment variables
import { apiConfig } from './apiConfig';

export const config = {
  // API Configuration - Now centralized in apiConfig.ts
  api: {
    baseUrl: apiConfig.environment.baseUrl,
    timeout: apiConfig.timeout,
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Pro Traders Group',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'شات بوت التداول الذكي',
  },

  // Google OAuth Configuration
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  },

  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
  },

  // Feature Flags
  features: {
    googleLogin: import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true',
    registration: import.meta.env.VITE_ENABLE_REGISTRATION === 'true',
    chatbot: import.meta.env.VITE_ENABLE_CHATBOT === 'true',
    export: import.meta.env.VITE_ENABLE_EXPORT === 'true',
  },

  // UI Configuration
  ui: {
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar',
    supportedLanguages: (import.meta.env.VITE_SUPPORTED_LANGUAGES || 'ar,en').split(','),
    theme: import.meta.env.VITE_THEME || 'dark',
  },

  // Development Configuration
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'debug',
  },

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
};

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

export const log = (level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any) => {
  if (!config.development.debugMode) return;

  const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  const currentLevel = logLevels[config.development.logLevel as keyof typeof logLevels] || 0;
  const messageLevel = logLevels[level];

  if (messageLevel >= currentLevel) {
    console[level](`[${config.app.name}] ${message}`, data || '');
  }
};

// Default export
export default config; 