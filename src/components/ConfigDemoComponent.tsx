import React, { useState } from 'react';
import { apiConfig, API_ENVIRONMENTS } from '../config/apiConfig';
import EnvironmentSwitcher from '../utils/environmentSwitcher';

const ConfigDemoComponent: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleSwitchEnvironment = (envName: string) => {
    if (confirm(`Switch to ${envName} environment? This will reload the page.`)) {
      EnvironmentSwitcher.switchEnvironment(envName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎯 Centralized Configuration Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This demonstrates the new centralized API configuration system
        </p>
      </div>

      {/* Current Configuration */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
          ✅ Current Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-green-700 dark:text-green-300">Environment:</span>
            <p className="font-medium text-green-900 dark:text-green-100">{apiConfig.environment.name}</p>
          </div>
          <div>
            <span className="text-sm text-green-700 dark:text-green-300">Base URL:</span>
            <p className="font-mono text-sm text-green-900 dark:text-green-100 break-all">{apiConfig.environment.baseUrl}</p>
          </div>
          <div>
            <span className="text-sm text-green-700 dark:text-green-300">Description:</span>
            <p className="text-green-900 dark:text-green-100">{apiConfig.environment.description}</p>
          </div>
          <div>
            <span className="text-sm text-green-700 dark:text-green-300">Timeout:</span>
            <p className="text-green-900 dark:text-green-100">{apiConfig.timeout}ms</p>
          </div>
        </div>
      </div>

      {/* Quick Environment Switcher */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🔄 Quick Environment Switch
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(API_ENVIRONMENTS).map(([key, env]) => (
            <button
              key={key}
              onClick={() => handleSwitchEnvironment(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                key === apiConfig.environment.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {env.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Endpoints */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🔗 Sample Generated Endpoints
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-sm text-gray-600 dark:text-gray-400">Auth Login:</span>
            <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
              {apiConfig.endpoints.auth.login}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-sm text-gray-600 dark:text-gray-400">Chatbot Send Message:</span>
            <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
              {apiConfig.endpoints.chatbot.sendMessage}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <span className="text-sm text-gray-600 dark:text-gray-400">User Profile:</span>
            <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
              {apiConfig.endpoints.user.profile}
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>{showDetails ? '▼' : '▶'}</span>
          <span className="font-medium">How It Works</span>
        </button>
        
        {showDetails && (
          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="space-y-3 text-sm text-blue-900 dark:text-blue-100">
              <p><strong>1. Single Configuration File:</strong> All API URLs are defined in <code>src/config/apiConfig.ts</code></p>
              <p><strong>2. Environment Variable:</strong> Set <code>VITE_API_ENVIRONMENT=test</code> to choose environment</p>
              <p><strong>3. Automatic Generation:</strong> All endpoints are automatically generated from the base URL</p>
              <p><strong>4. Runtime Switching:</strong> Use the switcher to change environments without rebuilding</p>
              <p><strong>5. Type Safety:</strong> Full TypeScript support for all configurations</p>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🎯 Before (Old System)</h4>
          <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <li>• Multiple environment files</li>
            <li>• Manual URL updates</li>
            <li>• Easy to make mistakes</li>
            <li>• No runtime switching</li>
          </ul>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🚀 After (New System)</h4>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <li>• Single configuration file</li>
            <li>• Automatic URL generation</li>
            <li>• Type-safe and error-free</li>
            <li>• Runtime environment switching</li>
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          📋 Next Steps
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>1. <strong>Test the API:</strong> Use the API Test Component to verify connectivity</p>
          <p>2. <strong>Switch Environments:</strong> Try switching between different environments</p>
          <p>3. <strong>Add New Endpoints:</strong> Edit <code>apiConfig.ts</code> to add new API endpoints</p>
          <p>4. <strong>Deploy:</strong> Set <code>VITE_API_ENVIRONMENT=production</code> for production</p>
        </div>
      </div>
    </div>
  );
};

export default ConfigDemoComponent; 