import React from 'react';
import { IconProps } from '@/types/ui';

export const XLogo: React.FC<IconProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      style={{
        userSelect: 'none',
        fill: 'currentColor',
        pointerEvents: 'auto',
      }}
    >
      <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z" />
    </svg>
  );
};

export const GrokIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
};
