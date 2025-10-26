'use client';
import React, { useEffect, useState } from 'react';
import Label from './Label';

function Timing({ time, full = false }: { time: Date; full?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[time.getMonth()];
  const day = time.getDate();
  const year = time.getFullYear();
  const formatted = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm} · ${month} ${day}, ${year}
`;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  let shownDate = '';
  if (seconds < 60) {
    shownDate = `${seconds}s`;
  } else if (seconds < 3600) {
    shownDate = `${Math.floor(seconds / 60)}m`;
  } else if (seconds < 3600 * 24) {
    shownDate = `${Math.floor(seconds / 3600)}h`;
  } else if (seconds < 3600 * 24 * 7) {
    shownDate = `${Math.floor(seconds / (3600 * 24))}d`;
  } else if (seconds < 3600 * 24 * 30 * 12) {
    shownDate = `${month} ${day}`;
  } else {
    shownDate = `${month} ${day}, ${year}`;
  }

  // Don't render time until client-side to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="text-gray-400 text-sm relative hover:cursor-pointer group">
        <span className="hover:underline">...</span>
      </div>
    );
  }

  return (
    <div className="text-gray-400 text-sm relative hover:cursor-pointer group">
      <span className="hover:underline">{full ? formatted : shownDate}</span>
      <Label label={formatted} />
    </div>
  );
}

export default Timing;
