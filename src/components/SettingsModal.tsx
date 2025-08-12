import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings, Bell, User, Grid3X3, Shield, Database, ChevronDown, Play, 
  LogOut, Eye, EyeOff, Trash2, Download, Globe, Volume2,
  Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'notifications' | 'personalization' | 'connected-apps' | 'data-controls' | 'security' | 'account';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [spokenLanguage, setSpokenLanguage] = useState<'auto' | 'ar' | 'en'>(() => {
    const savedSpokenLanguage = localStorage.getItem('app-spoken-language');
    return (savedSpokenLanguage as 'auto' | 'ar' | 'en') || 'auto';
  });
  const [voice, setVoice] = useState('ember');
  const [followUpSuggestions, setFollowUpSuggestions] = useState(true);
  const [advancedAnalysis, setAdvancedAnalysis] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [tradingAlerts, setTradingAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);

  // Personalization settings
  const [autoSave, setAutoSave] = useState(true);
  const [showTutorials, setShowTutorials] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const settingsTabs = [
    { id: 'general', label: t.settings.general, icon: Settings },
    { id: 'notifications', label: t.settings.notifications, icon: Bell },
    { id: 'personalization', label: t.settings.personalization, icon: User },
    { id: 'connected-apps', label: t.settings.connectedApps, icon: Grid3X3 },
    { id: 'data-controls', label: t.settings.dataControls, icon: Database },
    { id: 'security', label: t.settings.security, icon: Shield },
    { id: 'account', label: t.settings.account, icon: User },
  ];



  const languages = [
    { value: 'auto', label: 'تلقائي', icon: Globe },
    { value: 'ar', label: 'العربية', icon: null },
    { value: 'en', label: 'English', icon: null },
  ];

  const voices = [
    { value: 'ember', label: 'Ember' },
    { value: 'nova', label: 'Nova' },
    { value: 'echo', label: 'Echo' },
    { value: 'shimmer', label: 'Shimmer' },
  ];





  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const showSuccess = (message: string) => {
    setShowSuccessMessage(message);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };



  const handleLanguageChange = (newLanguage: 'auto' | 'ar' | 'en') => {
    setLanguage(newLanguage);
    showSuccess(`${t.settings.success.languageChanged} ${languages.find(l => l.value === newLanguage)?.label}`);
  };

  const handleSpokenLanguageChange = (newLanguage: 'auto' | 'ar' | 'en') => {
    setSpokenLanguage(newLanguage);
    localStorage.setItem('app-spoken-language', newLanguage);
    showSuccess(`${t.settings.success.spokenLanguageChanged} ${languages.find(l => l.value === newLanguage)?.label}`);
  };

  const handleVoiceChange = (newVoice: string) => {
    setVoice(newVoice);
    showSuccess(`${t.settings.success.voiceChanged} ${voices.find(v => v.value === newVoice)?.label}`);
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    switch (type) {
      case 'email':
        setEmailNotifications(value);
        showSuccess(value ? t.settings.success.emailNotificationsEnabled : t.settings.success.emailNotificationsDisabled);
        break;
      case 'push':
        setPushNotifications(value);
        showSuccess(value ? t.settings.success.pushNotificationsEnabled : t.settings.success.pushNotificationsDisabled);
        break;
      case 'trading':
        setTradingAlerts(value);
        showSuccess(value ? t.settings.success.tradingAlertsEnabled : t.settings.success.tradingAlertsDisabled);
        break;
      case 'market':
        setMarketUpdates(value);
        showSuccess(value ? t.settings.success.marketUpdatesEnabled : t.settings.success.marketUpdatesDisabled);
        break;
    }
  };

  const handlePersonalizationChange = (type: string, value: boolean) => {
    switch (type) {
      case 'autoSave':
        setAutoSave(value);
        showSuccess(value ? t.settings.success.autoSaveEnabled : t.settings.success.autoSaveDisabled);
        break;
      case 'tutorials':
        setShowTutorials(value);
        showSuccess(value ? t.settings.success.tutorialsEnabled : t.settings.success.tutorialsDisabled);
        break;
      case 'compact':
        setCompactMode(value);
        showSuccess(value ? t.settings.success.compactModeEnabled : t.settings.success.compactModeDisabled);
        break;
    }
  };

  const handleLogout = () => {
    showSuccess(t.settings.success.loggingOut);
    setTimeout(() => {
      console.log('Logging out...');
      onClose();
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm(t.settings.deleteAccountConfirm)) {
      showSuccess(t.settings.success.deletingAccount);
      setTimeout(() => {
        console.log('Deleting account...');
        onClose();
      }, 1000);
    }
  };

  const handleExportData = () => {
    showSuccess(t.settings.success.dataExported);
    setTimeout(() => {
      console.log('Exporting data...');
    }, 1000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert(t.settings.passwordMismatch);
      return;
    }
    showSuccess(t.settings.success.passwordChanged);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getTabTitle = (tabId: SettingsTab) => {
    const tab = settingsTabs.find(t => t.id === tabId);
    return tab?.label || '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="settings-modal"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="settings-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Message */}
            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 z-50"
                >
                  <Check size={16} />
                  {showSuccessMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="settings-header">
              <h2 className="text-lg font-semibold text-white">{getTabTitle(activeTab)}</h2>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="settings-sidebar">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as SettingsTab)}
                      className={`settings-nav-item w-full ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="settings-panel">
                {activeTab === 'general' && (
                  <div className="space-y-6">

                    <div className="settings-section">
                      <label className="settings-label">اللغة</label>
                      <div className="dropdown relative">
                        <button 
                          className="settings-select flex items-center justify-between"
                          onClick={() => handleDropdownToggle('language')}
                        >
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = languages.find(l => l.value === language)?.icon;
                              return Icon ? <Icon size={16} /> : null;
                            })()}
                            <span>{languages.find(l => l.value === language)?.label}</span>
                          </div>
                          <ChevronDown size={16} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === 'language' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="dropdown-content"
                            >
                              {languages.map((langOption) => {
                                const Icon = langOption.icon;
                                return (
                                  <div
                                    key={langOption.value}
                                    className={`dropdown-item ${language === langOption.value ? 'active' : ''}`}
                                    onClick={() => {
                                      handleLanguageChange(langOption.value as any);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {Icon && <Icon size={16} />}
                                    <span>{langOption.label}</span>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="settings-section">
                      <label className="settings-label">اللغة المنطوقة</label>
                      <div className="dropdown relative">
                        <button 
                          className="settings-select flex items-center justify-between"
                          onClick={() => handleDropdownToggle('spoken')}
                        >
                          <div className="flex items-center gap-2">
                            <Volume2 size={16} />
                            <span>{languages.find(l => l.value === spokenLanguage)?.label}</span>
                          </div>
                          <ChevronDown size={16} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === 'spoken' && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="dropdown-content"
                            >
                              {languages.map((langOption) => {
                                const Icon = langOption.icon;
                                return (
                                  <div
                                    key={langOption.value}
                                    className={`dropdown-item ${spokenLanguage === langOption.value ? 'active' : ''}`}
                                    onClick={() => {
                                      handleSpokenLanguageChange(langOption.value as any);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {Icon && <Icon size={16} />}
                                    <span>{langOption.label}</span>
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        للحصول على أفضل النتائج، اختر اللغة التي تتحدثها بشكل أساسي. إذا لم تكن مدرجة، فقد تكون مدعومة عبر الكشف التلقائي.
                      </p>
                    </div>

                    <div className="settings-section">
                      <label className="settings-label">الصوت</label>
                      <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                          <Play size={16} />
                        </button>
                        <div className="dropdown relative flex-1">
                          <button 
                            className="settings-select flex items-center justify-between w-full"
                            onClick={() => handleDropdownToggle('voice')}
                          >
                            <span>{voices.find(v => v.value === voice)?.label}</span>
                            <ChevronDown size={16} />
                          </button>
                          <AnimatePresence>
                            {openDropdown === 'voice' && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="dropdown-content"
                              >
                                {voices.map((voiceOption) => (
                                  <div
                                    key={voiceOption.value}
                                    className={`dropdown-item ${voice === voiceOption.value ? 'active' : ''}`}
                                    onClick={() => {
                                      handleVoiceChange(voiceOption.value);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    {voiceOption.label}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <label className="settings-label">إظهار اقتراحات المتابعة في المحادثات</label>
                        <button
                          onClick={() => setFollowUpSuggestions(!followUpSuggestions)}
                          className={`settings-toggle ${followUpSuggestions ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <label className="settings-label">تفعيل التحليل المالي المتقدم</label>
                        <button
                          onClick={() => setAdvancedAnalysis(!advancedAnalysis)}
                          className={`settings-toggle ${advancedAnalysis ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        تفعيل ميزات الذكاء الاصطناعي المتقدمة لتحليل السوق والتداول
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">إشعارات البريد الإلكتروني</label>
                          <p className="text-xs text-gray-400 mt-1">استلام إشعارات عبر البريد الإلكتروني</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('email', !emailNotifications)}
                          className={`settings-toggle ${emailNotifications ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">الإشعارات الفورية</label>
                          <p className="text-xs text-gray-400 mt-1">إشعارات فورية في المتصفح</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('push', !pushNotifications)}
                          className={`settings-toggle ${pushNotifications ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">تنبيهات التداول</label>
                          <p className="text-xs text-gray-400 mt-1">تنبيهات عند تغير أسعار العملات</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('trading', !tradingAlerts)}
                          className={`settings-toggle ${tradingAlerts ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">تحديثات السوق</label>
                          <p className="text-xs text-gray-400 mt-1">أخبار وتحليلات السوق</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('market', !marketUpdates)}
                          className={`settings-toggle ${marketUpdates ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'personalization' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">الحفظ التلقائي</label>
                          <p className="text-xs text-gray-400 mt-1">حفظ المحادثات تلقائياً</p>
                        </div>
                        <button
                          onClick={() => handlePersonalizationChange('autoSave', !autoSave)}
                          className={`settings-toggle ${autoSave ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">عرض الدروس التعليمية</label>
                          <p className="text-xs text-gray-400 mt-1">عرض نصائح ودروس تعليمية</p>
                        </div>
                        <button
                          onClick={() => handlePersonalizationChange('tutorials', !showTutorials)}
                          className={`settings-toggle ${showTutorials ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    <div className="settings-section">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="settings-label">الوضع المضغوط</label>
                          <p className="text-xs text-gray-400 mt-1">عرض أكثر محتوى في الشاشة</p>
                        </div>
                        <button
                          onClick={() => handlePersonalizationChange('compact', !compactMode)}
                          className={`settings-toggle ${compactMode ? 'active' : ''}`}
                        >
                          <div className="settings-toggle-thumb" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'connected-apps' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <h3 className="text-sm font-medium text-white mb-4">التطبيقات المتصلة</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">MT</span>
                            </div>
                            <div>
                              <p className="text-white text-sm">MetaTrader 5</p>
                              <p className="text-gray-400 text-xs">متصل</p>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-sm">فصل</button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">TG</span>
                            </div>
                            <div>
                              <p className="text-white text-sm">Telegram</p>
                              <p className="text-gray-400 text-xs">متصل</p>
                            </div>
                          </div>
                          <button className="text-red-400 hover:text-red-300 text-sm">فصل</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'data-controls' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <h3 className="text-sm font-medium text-white mb-4">التحكم في البيانات</h3>
                      <div className="space-y-4">
                        <button 
                          onClick={handleExportData}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                          <Download size={16} />
                          تصدير البيانات
                        </button>
                        
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <h4 className="text-white text-sm font-medium mb-2">حذف البيانات</h4>
                          <p className="text-gray-400 text-xs mb-3">
                            حذف جميع البيانات المحفوظة بما في ذلك المحادثات والإعدادات
                          </p>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                            حذف جميع البيانات
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <h3 className="text-sm font-medium text-white mb-4">تغيير كلمة المرور</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="settings-label">كلمة المرور الحالية</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="settings-input pr-10"
                              placeholder="أدخل كلمة المرور الحالية"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="settings-label">كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="settings-input"
                            placeholder="أدخل كلمة المرور الجديدة"
                          />
                        </div>
                        
                        <div>
                          <label className="settings-label">تأكيد كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="settings-input"
                            placeholder="أعد إدخال كلمة المرور الجديدة"
                          />
                        </div>
                        
                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                          تغيير كلمة المرور
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div className="space-y-6">
                    <div className="settings-section">
                      <h3 className="text-sm font-medium text-white mb-4">معلومات الحساب</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="settings-label">البريد الإلكتروني</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              value="mohamedmansor0997@gmail.com"
                              className="settings-input flex-1"
                              readOnly
                            />
                            <button className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                              تعديل
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="settings-label">اسم المستخدم</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value="Mohamed Abd Elrahman Mansour"
                              className="settings-input flex-1"
                              readOnly
                            />
                            <button className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors">
                              تعديل
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3 className="text-sm font-medium text-white mb-4">إجراءات الحساب</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          تسجيل الخروج
                        </button>
                        
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          حذف الحساب
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 