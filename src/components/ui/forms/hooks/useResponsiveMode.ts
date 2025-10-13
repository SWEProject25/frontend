import { useState, useEffect } from 'react';

export function useResponsiveMode(mode: 'modal' | 'fullpage' | 'responsive') {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (mode === 'responsive') {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
      return () => window.removeEventListener('resize', checkIsMobile);
    }
  }, [mode]);

  const displayMode = (() => {
    if (mode === 'fullpage') return 'fullpage';
    if (mode === 'modal') return 'modal';
    if (mode === 'responsive') {
      if (!mounted) return 'modal'; // Default during SSR
      return isMobile ? 'fullpage' : 'modal';
    }
    return 'modal';
  })();

  return {
    displayMode,
    isMobile,
    mounted,
  };
}
