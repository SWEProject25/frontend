'use client';

import { useEffect, useRef } from 'react';

export default function Input({
  label,
  required = true,
  isActive = false,
  id,
  value,
  setValue,
}: {
  label: string;
  required?: boolean;
  isActive?: boolean;
  id: number;
  value: string;
  setValue: (id: number, value: string) => void;
}) {
  const active = value.length;
  const ref = useRef<null | HTMLInputElement>(null);
  useEffect(
    function () {
      if (ref.current && isActive) {
        ref.current.focus();
      }
    },
    [isActive]
  );
  return (
    <div className="w-full max-w-[435px]">
      <div className="relative">
        <input
          data-testid={`inut-${id}`}
          ref={ref}
          required={required}
          id={label}
          type="text"
          placeholder=" "
          value={value}
          onChange={(e) => setValue(id, e.target.value)}
          maxLength={25}
          spellCheck={false}
          // autoComplete="off"
          className="peer  w-full h-15 bg-transparent px-4 pt-4 text-base text-amber-50 outline-none transition-colors duration-150 border-1 border-solid border-text-inactive rounded-md focus:border-primary focus:border-3"
          aria-label={label}
        />

        <label
          htmlFor={label}
          className={`
            absolute left-3 pointer-events-none transition-all duration-150 ease-in-out text-text-inactive px-1  
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base  
            peer-focus:top-1 peer-focus:text-sm peer-focus:translate-y-0 peer-focus:scale-95 peer-focus:text-primary 
            ${active && 'top-1  text-sm translate-y-0 scale-95'}
            
            
          `}
        >
          {label}
        </label>

        <span className="hidden peer-focus:block absolute top-0 right-0 p-2 text-sm  text-text-inactive">
          {value.length} /25
        </span>
      </div>
    </div>
  );
}
//   peer-valid:h-[30px]  peer-valid:leading-[30px]  peer-valid:py-3   peer-valid:transform-[translate(-15px,-16px) scale(0.88]
// absolute text-[1.6em] text-[#f0ffff]  my-5 bg-[#1c2841] ease-[0.2]
