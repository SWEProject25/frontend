'use client';
import { Ref, useEffect, useRef, useState } from 'react';

export default function useOnScreen(
  options?: IntersectionObserverInit
): [Ref<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(
    function () {
      const observer = new IntersectionObserver(([entery]) => {
        setIsVisible(entery.isIntersecting);
      }, options);
      const element = ref.current;
      if (!element) return;
      observer.observe(element);
      return () => observer.unobserve(element);
    },
    [ref, options]
  );
  return [ref, isVisible];
}
