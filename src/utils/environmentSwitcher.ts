// Environment Switcher Utility
// This utility allows you to easily switch between different API environments

import { API_ENVIRONMENTS, getCurrentEnvironment } from '../config/apiConfig';

export interface EnvironmentInfo {
  name: string;
  baseUrl: string;
  description: string;
  isCurrent: boolean;
}

export class EnvironmentSwitcher {
  // Get all available environments
  static getAvailableEnvironments(): EnvironmentInfo[] {
    const currentEnv = getCurrentEnvironment();
    
    return Object.entries(API_ENVIRONMENTS).map(([key, env]) => ({
      name: env.name,
      baseUrl: env.baseUrl,
      description: env.description,
      isCurrent: key === currentEnv,
    }));
  }

  // Get current environment info
  static getCurrentEnvironmentInfo(): EnvironmentInfo {
    const currentEnv = getCurrentEnvironment();
    const env = API_ENVIRONMENTS[currentEnv];
    
    return {
      name: env.name,
      baseUrl: env.baseUrl,
      description: env.description,
      isCurrent: true,
    };
  }

  // Switch to a different environment (for development/testing)
  static switchEnvironment(environmentName: string): boolean {
    const availableEnvs = Object.keys(API_ENVIRONMENTS);
    
    if (!availableEnvs.includes(environmentName)) {
      console.error(`Environment '${environmentName}' not found. Available:`, availableEnvs);
      return false;
    }

    // Store the environment preference in localStorage
    localStorage.setItem('preferred_api_environment', environmentName);
    
    console.log(`Switched to ${environmentName} environment`);
    console.log('New base URL:', API_ENVIRONMENTS[environmentName].baseUrl);
    
    // Reload the page to apply the new configuration
    window.location.reload();
    
    return true;
  }

  // Get environment from localStorage or environment variable
  static getPreferredEnvironment(): string {
    // Check localStorage first (for runtime switching)
    const stored = localStorage.getItem('preferred_api_environment');
    if (stored && API_ENVIRONMENTS[stored]) {
      return stored;
    }
    
    // Fall back to environment variable
    return getCurrentEnvironment();
  }

  // Reset to default environment
  static resetToDefault(): void {
    localStorage.removeItem('preferred_api_environment');
    window.location.reload();
  }

  // Test connectivity to all environments
  static async testAllEnvironments(): Promise<Record<string, { success: boolean; responseTime: number; error?: string }>> {
    const results: Record<string, { success: boolean; responseTime: number; error?: string }> = {};
    
    for (const [envName, env] of Object.entries(API_ENVIRONMENTS)) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${env.baseUrl}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        const endTime = Date.now();
        
        results[envName] = {
          success: response.ok,
          responseTime: endTime - startTime,
        };
      } catch (error) {
        results[envName] = {
          success: false,
          responseTime: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
    
    return results;
  }

  // Get environment status (online/offline)
  static async getEnvironmentStatus(): Promise<Record<string, 'online' | 'offline' | 'unknown'>> {
    const status: Record<string, 'online' | 'offline' | 'unknown'> = {};
    
    for (const [envName, env] of Object.entries(API_ENVIRONMENTS)) {
      try {
        const response = await fetch(`${env.baseUrl}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        
        status[envName] = response.ok ? 'online' : 'offline';
      } catch (error) {
        status[envName] = 'offline';
      }
    }
    
    return status;
  }
}

// Export for use in components
export default EnvironmentSwitcher; 