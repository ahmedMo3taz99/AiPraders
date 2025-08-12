import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

interface MarketAnalysisProps {
  data: MarketData[];
  isLoading?: boolean;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ data, isLoading = false }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp size={16} className="text-green-400" />;
      case 'bearish':
        return <TrendingDown size={16} className="text-red-400" />;
      default:
        return <Minus size={16} className="text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  if (isLoading) {
    return (
      <div className="market-analysis">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 size={20} className="text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">تحليل السوق</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-shimmer h-12 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="market-analysis"
    >
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={20} className="text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">تحليل السوق</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              {getTrendIcon(item.trend)}
              <div>
                <h4 className="font-semibold text-white">{item.symbol}</h4>
                <p className="text-sm text-gray-400">
                  الحجم: {item.volume.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">
                ${item.price.toFixed(2)}
              </p>
              <p className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-600/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">التحديث الأخير:</span>
          <span className="text-white">
            {new Date().toLocaleTimeString('ar-SA')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}; 