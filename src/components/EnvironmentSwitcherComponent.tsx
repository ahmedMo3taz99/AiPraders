import React, { useState, useEffect } from 'react';
import EnvironmentSwitcher, { EnvironmentInfo } from '../utils/environmentSwitcher';
import { apiConfig } from '../config/apiConfig';

const EnvironmentSwitcherComponent: React.FC = () => {
  const [environments, setEnvironments] = useState<EnvironmentInfo[]>([]);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; responseTime: number; error?: string }>>({});
  const [statusResults, setStatusResults] = useState<Record<string, 'online' | 'offline' | 'unknown'>>({});

  useEffect(() => {
    loadEnvironments();
  }, []);

  const loadEnvironments = () => {
    const envs = EnvironmentSwitcher.getAvailableEnvironments();
    const current = EnvironmentSwitcher.getCurrentEnvironmentInfo();
    setEnvironments(envs);
    setCurrentEnv(current);
  };

  const handleEnvironmentSwitch = (envName: string) => {
    if (confirm(`Switch to ${envName} environment? This will reload the page.`)) {
      EnvironmentSwitcher.switchEnvironment(envName);
    }
  };

  const handleTestAllEnvironments = async () => {
    setIsLoading(true);
    try {
      const results = await EnvironmentSwitcher.testAllEnvironments();
      setTestResults(results);
    } catch (error) {
      console.error('Error testing environments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setIsLoading(true);
    try {
      const status = await EnvironmentSwitcher.getEnvironmentStatus();
      setStatusResults(status);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset to default environment? This will reload the page.')) {
      EnvironmentSwitcher.resetToDefault();
    }
  };

  const getStatusColor = (status: 'online' | 'offline' | 'unknown') => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: 'online' | 'offline' | 'unknown') => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Environment Configuration
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage API environments and test connectivity
        </p>
      </div>

      {/* Current Environment */}
      {currentEnv && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Current Environment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Name:</span>
              <p className="font-medium text-blue-900 dark:text-blue-100">{currentEnv.name}</p>
            </div>
            <div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Base URL:</span>
              <p className="font-mono text-sm text-blue-900 dark:text-blue-100 break-all">{currentEnv.baseUrl}</p>
            </div>
            <div>
              <span className="text-sm text-blue-700 dark:text-blue-300">Description:</span>
              <p className="text-blue-900 dark:text-blue-100">{currentEnv.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleTestAllEnvironments}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test All Environments'}
        </button>
        
        <button
          onClick={handleCheckStatus}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
        
        <button
          onClick={handleResetToDefault}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Reset to Default
        </button>
      </div>

      {/* Environment List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Available Environments
        </h3>
        
        {environments.map((env) => (
          <div
            key={env.name}
            className={`p-4 rounded-lg border ${
              env.isCurrent
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {env.name}
                    {env.isCurrent && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded">
                        Current
                      </span>
                    )}
                  </h4>
                  {statusResults[env.name] && (
                    <span className={`text-sm ${getStatusColor(statusResults[env.name])}`}>
                      {getStatusIcon(statusResults[env.name])} {statusResults[env.name]}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {env.description}
                </p>
                
                <p className="font-mono text-xs text-gray-500 dark:text-gray-400 break-all">
                  {env.baseUrl}
                </p>
                
                {testResults[env.name] && (
                  <div className="mt-2 text-xs">
                    <span className={`${
                      testResults[env.name].success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {testResults[env.name].success ? '✅' : '❌'} 
                      {testResults[env.name].success ? 'Connected' : 'Failed'}
                    </span>
                    {testResults[env.name].responseTime > 0 && (
                      <span className="text-gray-500 ml-2">
                        ({testResults[env.name].responseTime}ms)
                      </span>
                    )}
                    {testResults[env.name].error && (
                      <span className="text-red-500 ml-2">
                        Error: {testResults[env.name].error}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {!env.isCurrent && (
                <button
                  onClick={() => handleEnvironmentSwitch(env.name)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Switch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Configuration Info
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>• Environment switching is stored in localStorage</p>
          <p>• Page will reload when switching environments</p>
          <p>• Default environment is determined by VITE_API_ENVIRONMENT variable</p>
          <p>• Current timeout: {apiConfig.timeout}ms</p>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentSwitcherComponent; 