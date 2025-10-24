import React from 'react';

function Label({ label }: { label: string }) {
  return (
    <div
      className={`
          absolute left-1/2 -translate-x-1/2 top-6
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-opacity
          text-white text-[10px] px-1.5 py-0.5 rounded
          bg-gray-600
          shadow
          z-10
          whitespace-nowrap
        `}
    >
      {label}
    </div>
  );
}

export default Label;
