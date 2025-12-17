import React from 'react';
import { CharCounterProps } from '../types';

export function CharCounter({ currentLength, maxLength }: CharCounterProps) {
  return (
    <div className="absolute right-4 top-2 text-sm text-text-counter transition-opacity duration-200">
      {currentLength} / {maxLength}
    </div>
  );
}
