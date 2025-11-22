import React from 'react';
import Label from './Label';
import { formatDateFull, formatDateRelative } from '../utils';

function Timing({ time, full = false }: { time: string; full?: boolean }) {
  const date = new Date(time);
  const formatted = formatDateFull(date);
  const shownDate = formatDateRelative(date);

  return (
    <div
      className="text-gray-400 text-sm relative hover:cursor-pointer group"
      data-testid="tweet-timing"
    >
      <span className="hover:underline">{full ? formatted : shownDate}</span>
      <Label label={formatted} />
    </div>
  );
}

export default Timing;
