'use client';
import GifModal from '@/features/media/components/GifModal';
import { useGifACtions } from '@/features/media/store/useGif';
import Timeline from '@/features/timeline/components/Timeline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Page() {
  const { open } = useGifACtions();
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
  if (isLoading) return <div>Loading ....</div>;
  return (
    <>
      <div className="grid grid-cols-[1fr_600px_1fr] min-h-screen overflow-x-hidden  ">
        <aside className="bg-gray-100">Left</aside>
        <Timeline />
        <aside className="bg-gray-100">Left</aside>
      </div>
      <GifModal />
    </>
  );
}
