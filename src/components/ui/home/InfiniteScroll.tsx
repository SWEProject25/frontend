'use client';
import Loader from '@/components/generic/Loader';
import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  isLoadingInitial: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  children: React.ReactNode;
  hasMoreData: boolean;
  hasInitialData: boolean;
  loader?: React.ReactNode;
  threshold?: number;
  'data-testid'?: string;
  noMoreDataMessage?: string;
  noDataMessage?: string;
  showNoMoreData?: boolean;
}

export default function InfiniteScroll({
  isLoadingInitial,
  isLoadingMore,
  loadMore,
  children,
  hasMoreData,
  hasInitialData,
  loader,
  threshold = 100,
  'data-testid': testId,
  noMoreDataMessage = 'You have reached the end',
  noDataMessage = 'No data available',
  showNoMoreData = true,
}: Readonly<InfiniteScrollProps>) {
  const observerElement = useRef<HTMLDivElement | null>(null);
  useEffect(
    function () {
      const element = observerElement.current;
      if (!element) return;
      function handleIntersection(entries: IntersectionObserverEntry[]) {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            hasMoreData &&
            (!isLoadingMore || !isLoadingInitial)
          ) {
            loadMore();
          }
        }
      }
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0,
      });
      observer.observe(element);
      return () => {
        if (element) observer.unobserve(element);
      };
    },

    [isLoadingMore, isLoadingInitial, loadMore, hasMoreData, threshold]
  );
  return (
    <div data-testid={testId} className="w-full">
      {children}
      <div ref={observerElement}>
        {isLoadingMore && !isLoadingInitial && (
          <div
            className="flex justify-center items-center py-4"
            data-testid={testId ? `${testId}-loading-more` : undefined}
          >
            {loader || <Loader />}
          </div>
        )}
        {!hasMoreData &&
          !isLoadingMore &&
          !isLoadingInitial &&
          hasInitialData &&
          showNoMoreData && (
            <div
              className="flex flex-col items-center justify-center py-8 px-4"
              data-testid={testId ? `${testId}-end-message` : undefined}
            >
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                {noMoreDataMessage}
              </p>
              <div className="mt-2 h-1 w-24 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent rounded-full"></div>
            </div>
          )}
        {!hasInitialData && (
          <div
            className="flex flex-col items-center justify-center py-12 px-4"
            data-testid={testId ? `${testId}-no-data` : undefined}
          >
            <p className="text-gray-600 dark:text-gray-300 text-lg font-semibold mb-2">
              {noDataMessage}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center max-w-xs">
              There&apos;s nothing to display at the moment
            </p>
            <div className="mt-4 flex gap-2">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
