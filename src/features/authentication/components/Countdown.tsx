'use client';

import React, { useEffect, useState } from 'react';

export interface CountdownProps {
  initialSeconds: number;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({
  initialSeconds,
  onComplete,
  className,
}: CountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

  return <span className={className}>{display}</span>;
}
