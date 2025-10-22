import React from 'react';
import { cn } from '@/lib/utils';
import { SpinnerIcon } from '@/components/ui/icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'social'
    | 'error'
    | 'error-outline';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'circle';
  loading?: boolean;
  fullWidth?: boolean;
  noBorder?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      shape = 'rounded',
      loading = false,
      fullWidth = false,
      noBorder = false,
      icon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center
      font-bold transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
      cursor-pointer
      disabled:cursor-not-allowed disabled:opacity-50
    `;

    const sizeStyles = {
      sm:
        shape === 'circle'
          ? 'w-8 h-8 text-sm'
          : 'px-4 py-1.5 text-sm min-h-[32px]',
      md:
        shape === 'circle'
          ? 'w-10 h-10 text-base'
          : 'px-6 py-2 text-base min-h-[40px]',
      lg:
        shape === 'circle'
          ? 'w-13 h-13 text-lg'
          : 'px-8 py-3 text-lg min-h-[52px]',
    };

    const variantStyles = {
      primary: `
        bg-primary text-text-button
        hover:bg-primary-hover
        disabled:bg-color-input-border-focus disabled:text-color-background disabled:shadow-inner
      `,
      secondary: `
        bg-background text-text-active
        border border-border'
        hover:bg-muted
        disabled:bg-background disabled:text-text-inactive disabled:border-border disabled:shadow-inner
      `,
      outline: `
        bg-transparent text-text-active
        border border-border
        hover:bg-muted hover:bg-opacity-20
        disabled:text-text-inactive disabled:border-border disabled:shadow-inner
      `,
      social: `
        bg-white text-background
        ${noBorder ? '' : 'border border-border'}
        hover:bg-gray-100
        disabled:bg-gray-200 disabled:text-gray-400
      `,
      ghost: `
        bg-transparent text-text-active
        hover:bg-muted hover:bg-opacity-10
        disabled:text-text-inactive disabled:shadow-inner
      `,
      error: `
        bg-error text-white
        disabled:bg-red-300 disabled:text-white disabled:shadow-inner
      `,
      'error-outline': `
        bg-transparent text-error
        border border-error
        disabled:text-red-300 disabled:border-red-300 disabled:shadow-inner
      `,
    };

    const shapeStyles = shape === 'circle' ? 'rounded-full' : 'rounded-full';
    const widthStyles = fullWidth && shape !== 'circle' ? 'w-full' : '';

    return (
      <button
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          shapeStyles,
          widthStyles,
          loading && 'opacity-70',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
          </span>
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        <span className={loading ? 'invisible' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
