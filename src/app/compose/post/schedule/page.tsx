'use client';
import ScheduleModal from '@/features/timeline/components/schedule/ScheduleModal';
import Timeline from '@/features/timeline/components/Timeline';
import useScheduleStore from '@/features/timeline/store/useScheduleStore';
import { useEffect } from 'react';

export default function SchedulePage() {
  const open = useScheduleStore((state) => state.open);
  useEffect(
    function () {
      function handleOpenSchedule() {
        open();
      }
      handleOpenSchedule();
    },
    [open]
  );
  return (
    <>
      <div className="grid grid-cols-[1fr_600px_1fr] min-h-screen overflow-x-hidden  ">
        <aside className="bg-gray-100">Left</aside>
        <Timeline />
        <aside className="bg-gray-100">Left</aside>
      </div>
      <ScheduleModal />
    </>
  );
}
