import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  google_id?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => Promise<boolean>;
  googleLogin: (accessToken: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        console.error('Login failed:', response.message);
        // Throw error with message for better error handling
        throw new Error(response.message || 'فشل تسجيل الدخول');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const response = await authAPI.register(data);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        console.error('Registration failed:', response.message);
        // Throw error with message for better error handling
        throw new Error(response.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const googleLogin = async (accessToken: string): Promise<boolean> => {
    try {
      const response = await authAPI.googleLogin({ access_token: accessToken });
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        console.error('Google login failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 