import React, { useState } from 'react';
import apiTest from '../utils/apiTest';
import { apiConfig } from '../config/apiConfig';

const ApiTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await apiTest.runAllTests();
      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const runSingleTest = async (testName: 'connection' | 'auth' | 'chatbot') => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      switch (testName) {
        case 'connection':
          result = await apiTest.testConnection();
          break;
        case 'auth':
          result = await apiTest.testAuth();
          break;
        case 'chatbot':
          result = await apiTest.testChatbot();
          break;
      }
      
      setTestResults({
        [testName]: result,
        summary: { total: 1, passed: result.success ? 1 : 0, failed: result.success ? 0 : 1 }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pro Traders Group API Test
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Current API Base URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {apiConfig.environment.baseUrl}
          </code>
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={runTests}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running Tests...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={() => runSingleTest('connection')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Connection
          </button>
          
          <button
            onClick={() => runSingleTest('auth')}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Auth
          </button>
          
          <button
            onClick={() => runSingleTest('chatbot')}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Test Chatbot
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {testResults && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Test Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {testResults.summary.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {testResults.summary.passed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {testResults.summary.failed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Failed</div>
              </div>
            </div>
          </div>

          {testResults.connection && (
            <div className={`p-4 rounded-lg border ${
              testResults.connection.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Connection Test
              </h4>
              <p className={`text-sm ${
                testResults.connection.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {testResults.connection.message}
              </p>
              {testResults.connection.data && (
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.connection.data, null, 2)}
                </pre>
              )}
            </div>
          )}

          {testResults.auth && (
            <div className={`p-4 rounded-lg border ${
              testResults.auth.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Authentication Test
              </h4>
              <p className={`text-sm ${
                testResults.auth.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {testResults.auth.message}
              </p>
              {testResults.auth.data && (
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.auth.data, null, 2)}
                </pre>
              )}
            </div>
          )}

          {testResults.chatbot && (
            <div className={`p-4 rounded-lg border ${
              testResults.chatbot.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Chatbot Test
              </h4>
              <p className={`text-sm ${
                testResults.chatbot.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {testResults.chatbot.message}
              </p>
              {testResults.chatbot.data && (
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(testResults.chatbot.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 