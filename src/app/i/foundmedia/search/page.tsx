'use client';
import GifModal from '@/features/media/components/GifModal';

import Timeline from '@/features/timeline/components/Timeline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/generic/Loader';
import LayoutWrapper from '@/features/layout/components/LayoutWrapper';
export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(
    function () {
      function handleOpenSchedule() {
        open();
      }
      const navEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navEntry?.type === 'reload') {
        // setIsReload(true);
        handleOpenSchedule();
        setIsLoading(false);
      } else router.push('/home');
    },
    [open, router]
  );
  if (isLoading)
    return (
      <div className="flex justify-center items-center w-64 h-64 mx-4">
        <Loader />
      </div>
    );
  return (
    <>
      <LayoutWrapper>
        <Timeline />
      </LayoutWrapper>
      <GifModal />
    </>
  );
}
