import React, { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollContainerProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  loader?: React.ReactNode;
  threshold?: number;
}

const InfiniteScrollContainer: React.FC<InfiniteScrollContainerProps> = ({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  loader,
  threshold = 100,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className="w-full">
      {children}
      <div ref={observerTarget} className="w-full h-4" />
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          {loader || (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
      {!hasMore && !isLoading && (
        <div className="flex justify-center items-center py-4 text-text-secondary">
          No more items to load
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollContainer;
