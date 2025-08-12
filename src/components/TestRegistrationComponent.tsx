import React, { useState } from 'react';
import { apiConfig } from '../config/apiConfig';
import { authAPI } from '../utils/api';

const TestRegistrationComponent: React.FC = () => {
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    phone: '+1234567890'
  });
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testRegistration = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔧 Testing registration with config:', {
        baseUrl: apiConfig.environment.baseUrl,
        endpoint: apiConfig.endpoints.auth.register,
        data: testData
      });

      const response = await authAPI.register(testData);
      setResult(response);
      console.log('✅ Registration test result:', response);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      console.error('❌ Registration test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${apiConfig.environment.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.text();
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data.substring(0, 200) + '...'
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🧪 Test Registration Component
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Debug registration issues and test API connectivity
        </p>
      </div>

      {/* Current Configuration */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Current Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Environment:</span>
            <p className="font-mono text-blue-900 dark:text-blue-100">{apiConfig.environment.name}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Base URL:</span>
            <p className="font-mono text-blue-900 dark:text-blue-100 break-all">{apiConfig.environment.baseUrl}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Register Endpoint:</span>
            <p className="font-mono text-blue-900 dark:text-blue-100 break-all">{apiConfig.endpoints.auth.register}</p>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Environment Variable:</span>
            <p className="font-mono text-blue-900 dark:text-blue-100">{import.meta.env.VITE_API_ENVIRONMENT || 'not set'}</p>
          </div>
        </div>
      </div>

      {/* Test Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Test Data
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={testData.name}
              onChange={(e) => setTestData({...testData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={testData.email}
              onChange={(e) => setTestData({...testData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={testData.password}
              onChange={(e) => setTestData({...testData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={testData.phone}
              onChange={(e) => setTestData({...testData, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={testApiConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test API Connection'}
        </button>
        
        <button
          onClick={testRegistration}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Registration'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Test Result
          </h3>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Debug Info */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Debug Information
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>• Check browser console for detailed logs</p>
          <p>• Verify API endpoint is accessible</p>
          <p>• Check network tab for request/response details</p>
          <p>• Ensure environment variables are set correctly</p>
        </div>
      </div>
    </div>
  );
};

export default TestRegistrationComponent; 