import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, BookOpen, Shield, Lightbulb, Target, Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
  className?: string;
}

const suggestedQuestions = [
  {
    id: 1,
    question: "كيف أبدأ في التداول؟",
    icon: TrendingUp,
    category: "أساسيات",
    description: "تعلم الخطوات الأولى للتداول"
  },
  {
    id: 2,
    question: "ما هي الشموع اليابانية؟",
    icon: BarChart3,
    category: "تحليل فني",
    description: "فهم أساسيات قراءة الرسوم البيانية"
  },
  {
    id: 3,
    question: "كيف أقرأ الرسم البياني؟",
    icon: BookOpen,
    category: "تعليمي",
    description: "دليل شامل لقراءة المخططات"
  },
  {
    id: 4,
    question: "ما هي إدارة المخاطر؟",
    icon: Shield,
    category: "أمان",
    description: "حماية رأس المال في التداول"
  },
  {
    id: 5,
    question: "ما هي أفضل استراتيجيات التداول؟",
    icon: Target,
    category: "استراتيجيات",
    description: "استراتيجيات ناجحة للتداول"
  },
  {
    id: 6,
    question: "كيف أختار الأسهم المناسبة؟",
    icon: Lightbulb,
    category: "اختيار",
    description: "معايير اختيار الأسهم الجيدة"
  }
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onQuestionClick,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          💡 اقتراحات ذكية
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          اختر سؤالاً لتبدأ رحلتك في التداول
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestedQuestions.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuestionClick(item.question)}
              className="group cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {item.question}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {item.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              نصيحة ذكية
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              يمكنك أيضاً رفع صورة لمخطط تداول للحصول على تحليل مفصل
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 