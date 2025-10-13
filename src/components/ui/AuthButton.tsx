import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types/ui';
import { SpinnerIcon } from './icons';

export const AuthButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-white text-background hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-white',
      secondary:
        'bg-muted text-foreground hover:bg-border-hover active:bg-border focus-visible:ring-border border border-border',
      outline:
        'border border-border bg-transparent text-foreground hover:bg-muted hover:bg-opacity-20 active:bg-border-hover active:bg-opacity-30 focus-visible:ring-border',
      social:
        'bg-white text-background hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-white border border-border',
      ghost:
        'bg-transparent text-foreground hover:bg-muted hover:bg-opacity-10 active:bg-border-hover active:bg-opacity-20 focus-visible:ring-border',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && 'cursor-not-allowed opacity-70',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <SpinnerIcon className="mr-2 h-4 w-4" />}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
