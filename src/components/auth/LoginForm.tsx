import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2, Zap, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // If successful, the user will be redirected automatically
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.message) {
        setError(error.message);
      } else if (error.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.errors).flat();
        setError(errorMessages.join(', '));
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Google OAuth implementation would go here
    console.log('Google login clicked');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md"
    >
      {/* Header Section with Logo */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
            <img src={logo} alt="Pro Traders Group" className="w-10 h-10" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full opacity-80"
          />
        </motion.div>
        
        <motion.h1 
          variants={itemVariants}
          className="text-2xl font-bold text-white mb-2"
        >
          Pro Traders Group
        </motion.h1>
        <motion.h2 
          variants={itemVariants}
          className="text-xl font-semibold text-emerald-400 mb-3"
        >
          تسجيل الدخول
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-300 text-sm">
          استكشف قوة الذكاء الاصطناعي في التداول
        </motion.p>
      </motion.div>

      {/* Form Container */}
      <motion.div 
        variants={itemVariants}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-100' : ''}`} />
                <div className="relative flex items-center">
                  <Mail className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-100' : ''}`} />
                <div className="relative flex items-center">
                  <Lock className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-300 backdrop-blur-sm"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 text-gray-400 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Forgot Password */}
            <motion.div variants={itemVariants} className="flex items-center justify-end">
              <motion.button
                type="button"
                onClick={onForgotPassword}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-300"
              >
                نسيت كلمة المرور؟
              </motion.button>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    <span>جاري تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800/90 text-gray-400 backdrop-blur-sm">أو</span>
              </div>
            </motion.div>

            {/* Google Login Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                تسجيل الدخول بجوجل
              </motion.button>
            </motion.div>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-400">
                ليس لديك حساب؟{' '}
                <motion.button
                  type="button"
                  onClick={onSwitchToRegister}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300"
                >
                  إنشاء حساب جديد
                </motion.button>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 grid grid-cols-1 gap-4"
      >
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>حماية متقدمة لحسابك</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>تحليلات ذكية للتداول</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>سرعة في التنفيذ</span>
        </div>
      </motion.div>
    </motion.div>
  );
}; 