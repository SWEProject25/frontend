import React from 'react';
import { EyeIcon, EyeSlashIcon } from '../../icons';
import { PasswordToggleProps } from '../types';

export function PasswordToggle({
  showPassword,
  onToggle,
  inputRef,
}: PasswordToggleProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();

    // Keep the input focused after clicking the eye
    if (inputRef && 'current' in inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent the button from stealing focus from the input
    e.preventDefault();
  };

  return (
    <button
      type="button"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-inactive hover:text-foreground focus:outline-none transition-all duration-200 p-1 rounded-full hover:bg-input-bg-hover"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      tabIndex={-1}
    >
      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
    </button>
  );
}
