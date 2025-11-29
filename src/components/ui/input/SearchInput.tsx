'use client';

import React, { useState, useRef } from 'react';
import { SearchIcon, CloseIcon } from '@/components/ui/icons';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
  hover?: boolean;
  clearColor?: string;
  hoverColor?: string;
}

export default function SearchInput({
  placeholder = 'Search Settings',
  value: externalValue,
  onChange,
  onClear,
  className = '',
  autoFocus = false,
  hover = false,
  clearColor = 'bg-primary',
  hoverColor = 'hover:bg-primary-hover',
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  const isControlled = externalValue !== undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      className={`
        relative flex items-center
        flex-1
        rounded-full
        border border-border
        focus-within:border-primary focus-within:bg-background
        transition-colors duration-200

        ${className}
      `}
    >
      <div className="pl-4 pr-3 flex items-center pointer-events-none">
        <SearchIcon className="w-4 h-5 text-text-secondary" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        data-testid="search-input"
        className="
          flex-1 bg-transparent
          py-3 pr-4
          text-[14px] text-text-active
          placeholder:text-text-secondary
          outline-none
          border-none
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className={`
            mr-3 p-1
            rounded-full
          ${clearColor}
          ${hoverColor}
            
            transition-colors duration-200
            flex items-center justify-center
            ${hover && 'hover:cursor-pointer'}
          `}
          aria-label="Clear search"
        >
          <CloseIcon className="w-3 h-3 text-background" />
        </button>
      )}
    </div>
  );
}
