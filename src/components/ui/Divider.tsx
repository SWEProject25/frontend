import React from 'react';
import { cn } from '@/lib/utils';
import { DividerProps } from '@/types/ui';

export function Divider({
  text,
  className,
  lineClassName,
  textClassName,
  orientation = 'horizontal',
  variant = 'default',
}: DividerProps) {
  const baseLineClasses = cn(
    'border-border',
    orientation === 'horizontal' ? 'border-t' : 'border-l',
    variant === 'dashed'
      ? 'border-dashed'
      : variant === 'dotted'
        ? 'border-dotted'
        : '',
    lineClassName
  );

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex items-center h-full', className)}>
        <div className={cn('h-full w-px', baseLineClasses)} />
      </div>
    );
  }

  if (text) {
    return (
      <div className={cn('relative', className)}>
        <div className={cn('absolute inset-0 flex items-center')}>
          <div className={cn('w-full', baseLineClasses)} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span
            className={cn(
              'px-2 bg-background text-foreground font-medium',
              textClassName
            )}
          >
            {text}
          </span>
        </div>
      </div>
    );
  }

  return <div className={cn('w-full', baseLineClasses, className)} />;
}
