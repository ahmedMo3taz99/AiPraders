import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Shield, TrendingUp, HelpCircle, X, ChevronRight } from 'lucide-react';

interface BeginnerModeProps {
  onClose: () => void;
  className?: string;
}

const tradingTerms = [
  {
    id: 1,
    term: "الشموع اليابانية",
    arabic: "Candlestick",
    definition: "طريقة لعرض حركة السعر في فترة زمنية محددة، حيث تظهر الشمعة الخضراء ارتفاع السعر والأحمر انخفاضه",
    example: "شمعة خضراء طويلة تعني أن السعر ارتفع بشكل كبير في هذه الفترة"
  },
  {
    id: 2,
    term: "مستوى الدعم",
    arabic: "Support Level",
    definition: "مستوى سعر يتوقع أن يجد فيه السعر دعمًا ويرتد للأعلى",
    example: "عندما يصل السعر إلى 100$ ويتوقف عن الانخفاض، هذا مستوى دعم"
  },
  {
    id: 3,
    term: "مستوى المقاومة",
    arabic: "Resistance Level",
    definition: "مستوى سعر يتوقع أن يجد فيه السعر مقاومة ويرتد للأسفل",
    example: "عندما يصل السعر إلى 150$ ويتوقف عن الارتفاع، هذا مستوى مقاومة"
  },
  {
    id: 4,
    term: "Stop Loss",
    arabic: "وقف الخسارة",
    definition: "أمر تلقائي لبيع السهم عند انخفاض السعر إلى مستوى محدد لتقليل الخسائر",
    example: "إذا اشتريت سهم بسعر 100$، ضع Stop Loss عند 95$"
  },
  {
    id: 5,
    term: "Take Profit",
    arabic: "جني الأرباح",
    definition: "أمر تلقائي لبيع السهم عند ارتفاع السعر إلى مستوى محدد لجني الأرباح",
    example: "إذا اشتريت سهم بسعر 100$، ضع Take Profit عند 120$"
  },
  {
    id: 6,
    term: "RSI",
    arabic: "مؤشر القوة النسبية",
    definition: "مؤشر فني يقيس سرعة وحجم التغيرات في الأسعار لتحديد ما إذا كان السهم مفرط في الشراء أو البيع",
    example: "RSI أعلى من 70 يعني السهم مفرط في الشراء، أقل من 30 يعني مفرط في البيع"
  },
  {
    id: 7,
    term: "MACD",
    arabic: "مؤشر التقارب والتباعد",
    definition: "مؤشر فني يظهر العلاقة بين متوسطين متحركين لسعر السهم",
    example: "عندما يتقاطع MACD مع خط الإشارة للأعلى، هذه إشارة شراء"
  },
  {
    id: 8,
    term: "حجم التداول",
    arabic: "Volume",
    definition: "عدد الأسهم المتداولة في فترة زمنية محددة",
    example: "حجم تداول عالي مع ارتفاع السعر يؤكد قوة الاتجاه الصاعد"
  }
];

const tradingSteps = [
  {
    id: 1,
    step: "تعلم الأساسيات",
    description: "افهم مفاهيم التداول الأساسية مثل الشموع اليابانية والمؤشرات الفنية",
    icon: BookOpen
  },
  {
    id: 2,
    step: "اختر استراتيجية",
    description: "حدد استراتيجية تداول تناسب شخصيتك ومستوى المخاطرة",
    icon: Target
  },
  {
    id: 3,
    step: "إدارة المخاطر",
    description: "ضع خطة لإدارة المخاطر واستخدم Stop Loss و Take Profit",
    icon: Shield
  },
  {
    id: 4,
    step: "ابدأ بالتداول",
    description: "ابدأ بمبالغ صغيرة وزد تدريجياً مع اكتساب الخبرة",
    icon: TrendingUp
  }
];

export const BeginnerMode: React.FC<BeginnerModeProps> = ({
  onClose,
  className = ''
}) => {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'terms' | 'steps'>('terms');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${className}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                وضع المبتدئين
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                تعلم أساسيات التداول خطوة بخطوة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'terms'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            📚 المصطلحات الأساسية
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'steps'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            🎯 خطوات البدء
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'terms' ? (
              <motion.div
                key="terms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tradingTerms.map((term) => (
                    <motion.div
                      key={term.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTerm(selectedTerm === term.id ? null : term.id)}
                      className="cursor-pointer bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {term.term}
                        </h3>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          selectedTerm === term.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {term.arabic}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {term.definition}
                      </p>
                      
                      <AnimatePresence>
                        {selectedTerm === term.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                          >
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                              <strong>مثال:</strong> {term.example}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="steps"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {tradingSteps.map((step, index) => {
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 rtl:space-x-reverse"
                    >
                      {step.icon && (
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <step.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {step.step}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                
                <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <HelpCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        نصيحة مهمة
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        لا تستثمر أكثر مما يمكنك تحمل خسارته، وابدأ دائماً بمبالغ صغيرة
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}; 