'use client';
import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  isLoadingInitial: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  children: React.ReactNode;
  hasMoreData: boolean;
}

export default function InfiniteScroll({
  isLoadingInitial,
  isLoadingMore,
  loadMore,
  children,
  hasMoreData,
}: InfiniteScrollProps) {
  const observerElement = useRef<HTMLDivElement | null>(null);
  useEffect(
    function () {
      function handleIntersection(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            hasMoreData &&
            (!isLoadingMore || !isLoadingInitial)
          )
            loadMore();
        });
      }
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      });
      if (observerElement.current) observer.observe(observerElement.current);
      return () => observer.disconnect();
    },

    [isLoadingMore, isLoadingInitial, loadMore]
  );
  return (
    <>
      <>{children}</>
      <div ref={observerElement}>
        {isLoadingMore && !isLoadingInitial && <div> Loading...</div>}
        {!hasMoreData && !isLoadingMore && !isLoadingInitial && (
          <div>No more data</div>
        )}
      </div>
    </>
  );
}
