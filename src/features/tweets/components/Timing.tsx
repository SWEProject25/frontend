import React from 'react';
import Label from './Label';
import { formatDateFull, formatDateRelative } from '../utils';

function Timing({
  time,
  full = false,
  hover = true,
}: {
  time?: string;
  full?: boolean;
  hover?: boolean;
}) {
  const date = new Date(time || '');
  const formatted = formatDateFull(date);
  const shownDate = formatDateRelative(date);

  return (
    <div
      className={`text-gray-400 text-sm relative ${hover ? 'hover:cursor-pointer group' : ''}`}
      data-testid="tweet-timing"
    >
      <span className={`${hover ? 'hover:underline' : ''}`}>
        {full ? formatted : shownDate}
      </span>
      {hover && <Label label={formatted} />}
    </div>
  );
}

export default Timing;
