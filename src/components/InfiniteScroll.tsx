import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
  threshold?: number;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  loading,
  onLoadMore,
  children,
  threshold = 100,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // إنشاء معرف فريد للمكون
  const componentId = useMemo(
    () => `infinite-scroll-${Date.now()}-${Math.random()}`,
    []
  );

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const element = loadingRef.current;
    if (element) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        rootMargin: `${threshold}px`,
      });
      observerRef.current.observe(element);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className="flex flex-col">
      {children}

      {/* Loading Indicator */}
      {hasMore && (
        <div
          key={`loading-indicator-${componentId}`}
          ref={loadingRef}
          className="flex justify-center items-center py-4"
        >
          {loading ? (
            <motion.div
              key={`loading-motion-${componentId}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <motion.div
                key={`loading-spinner-${componentId}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={16} />
              </motion.div>
              <span className="text-sm">جاري تحميل المزيد...</span>
            </motion.div>
          ) : (
            <div key={`invisible-element-${componentId}`} className="h-4" /> // Invisible element for intersection observer
          )}
        </div>
      )}

      {/* Pagination Info */}
      {totalItems > 0 && hasMore && (
        <div
          key={`pagination-info-${componentId}`}
          className="px-4 py-2 text-xs text-gray-500 border-t border-gray-700"
        >
          <div className="flex justify-between items-center">
            <span>
              الصفحة {currentPage} من {totalPages}
            </span>
            <span>
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} من {totalItems}{" "}
              محادثة
            </span>
          </div>
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && totalItems > 0 && (
        <motion.div
          key={`end-indicator-${componentId}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center py-4 text-gray-500 text-sm"
        >
          تم عرض جميع المحادثات ({totalItems} محادثة)
        </motion.div>
      )}
    </div>
  );
};
