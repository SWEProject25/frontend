import React from 'react';
import { SpinnerIcon } from '@/components/ui/icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-medium rounded-full
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    cursor-pointer
    disabled:cursor-not-allowed
  `;

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm min-h-[32px]',
    md: 'px-6 py-2 text-base min-h-[40px]',
    lg: 'px-8 py-3 text-lg min-h-[52px]',
  };

  const variantStyles = {
    primary: `
      bg-primary text-text-button
      hover:bg-primary-hover
      disabled:bg-color-input-border-focus disabled:text-color-background disabled:shadow-inner disabled:opacity-60
    `,
    secondary: `
      bg-background text-text-active border border-border
      hover:bg-muted
      disabled:bg-background disabled:text-text-inactive disabled:border-border disabled:shadow-inner disabled:opacity-60
    `,
    outline: `
      bg-transparent text-text-active border border-border
      hover:bg-muted
      disabled:text-text-inactive disabled:border-border disabled:shadow-inner disabled:opacity-60
    `,
    ghost: `
      bg-transparent text-text-active
      hover:bg-muted
      disabled:text-text-inactive disabled:shadow-inner disabled:opacity-60
    `,
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${widthStyles}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <SpinnerIcon className="w-5 h-5 animate-spin" />
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}
