import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { DragDropProvider } from './components/DragDropProvider'
import './index.css'

// Clear localStorage settings if custom base URL is set
if (typeof window !== 'undefined') {
  const customBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (customBaseUrl && customBaseUrl.trim() !== '') {
    localStorage.removeItem('preferred_api_environment');
    console.log('🧹 Cleared localStorage settings on app startup - using custom base URL:', customBaseUrl.trim());
  } else {
    console.log('⚠️ No custom base URL found in environment variables');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <DragDropProvider>
          <App />
        </DragDropProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
) 