import { log } from '../config';
import { getApiUrl } from '../config/apiConfig';

// API Test Utility for Pro Traders Group
export const apiTest = {
  // Test basic API connectivity
  testConnection: async (): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      log('debug', 'Testing API connection to Pro Traders Group');
      
      const response = await fetch(getApiUrl('/api/health'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'API connection successful',
          data
        };
      } else {
        return {
          success: false,
          message: `API connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      log('error', 'API connection test failed', error);
      return {
        success: false,
        message: `API connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  // Test authentication endpoint
  testAuth: async (): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      log('debug', 'Testing authentication endpoint');
      
      const response = await fetch(getApiUrl('/api/auth/check'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Authentication endpoint accessible',
          data
        };
      } else {
        return {
          success: false,
          message: `Authentication endpoint failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      log('error', 'Authentication test failed', error);
      return {
        success: false,
        message: `Authentication test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  // Test chatbot endpoint
  testChatbot: async (): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      log('debug', 'Testing chatbot endpoint');
      
      const response = await fetch(getApiUrl('/api/chatbot/status'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Chatbot endpoint accessible',
          data
        };
      } else {
        return {
          success: false,
          message: `Chatbot endpoint failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      log('error', 'Chatbot test failed', error);
      return {
        success: false,
        message: `Chatbot test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  // Run all tests
  runAllTests: async (): Promise<{
    connection: { success: boolean; message: string; data?: any };
    auth: { success: boolean; message: string; data?: any };
    chatbot: { success: boolean; message: string; data?: any };
    summary: { total: number; passed: number; failed: number };
  }> => {
    log('info', 'Running all API tests for Pro Traders Group');
    
    const connection = await apiTest.testConnection();
    const auth = await apiTest.testAuth();
    const chatbot = await apiTest.testChatbot();
    
    const total = 3;
    const passed = [connection, auth, chatbot].filter(test => test.success).length;
    const failed = total - passed;
    
    return {
      connection,
      auth,
      chatbot,
      summary: { total, passed, failed }
    };
  }
};

// Export for use in components
export default apiTest; 