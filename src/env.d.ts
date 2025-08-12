/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string

  // Google OAuth Configuration
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_SECRET: string

  // OpenAI Configuration
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_MODEL: string

  // Feature Flags
  readonly VITE_ENABLE_GOOGLE_LOGIN: string
  readonly VITE_ENABLE_REGISTRATION: string
  readonly VITE_ENABLE_CHATBOT: string
  readonly VITE_ENABLE_EXPORT: string
  readonly VITE_ENABLE_DEBUG_PANEL: string

  // UI Configuration
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_SUPPORTED_LANGUAGES: string
  readonly VITE_THEME: string

  // Development Configuration
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_SHOW_DEV_TOOLS: string
  readonly VITE_MOCK_API: string

  // Local Development Settings
  readonly VITE_DEV_SERVER_PORT: string
  readonly VITE_DEV_SERVER_HOST: string
  readonly VITE_HOT_RELOAD: string
  readonly VITE_SOURCE_MAPS: string

  // Testing Configuration
  readonly VITE_ENABLE_TESTING: string
  readonly VITE_TEST_API_URL: string
  readonly VITE_MOCK_RESPONSES: string

  // Performance Settings
  readonly VITE_ENABLE_CACHING: string
  readonly VITE_CACHE_DURATION: string
  readonly VITE_ENABLE_COMPRESSION: string
  readonly VITE_ENABLE_MINIFICATION: string

  // Security Settings
  readonly VITE_ENABLE_HTTPS: string
  readonly VITE_ENABLE_CSP: string
  readonly VITE_ENABLE_HSTS: string

  // Analytics and Monitoring
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ANALYTICS_ID: string
  readonly VITE_ENABLE_ERROR_TRACKING: string
  readonly VITE_ERROR_TRACKING_URL: string

  // CDN Configuration
  readonly VITE_CDN_URL: string
  readonly VITE_ASSETS_URL: string

  // Third-party Services
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_MIXPANEL_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 