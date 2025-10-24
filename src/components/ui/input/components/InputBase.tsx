import React from 'react';
import { cn } from '@/lib/utils';
import { getFieldBaseStyles, getInputPadding } from '@/lib/formUtils';
import { InputBaseProps } from '../types';

export function InputBase({
  className,
  inputRef,
  onFocus,
  onBlur,
  styleProps,
  ...inputProps
}: InputBaseProps) {
  // If the caller passed a data-testid use it, otherwise try to provide a stable default
  const providedTestId = (
    inputProps as unknown as Record<string, string | undefined>
  )['data-testid'];
  const nameAttr = inputProps.name as string | undefined;
  const computedTestId =
    providedTestId ?? (nameAttr ? `auth-input-${nameAttr}` : undefined);

  return (
    <input
      className={cn(
        getFieldBaseStyles(styleProps),
        getInputPadding(styleProps.shouldFloatLabel || false),
        className
      )}
      onFocus={onFocus}
      onBlur={onBlur}
      ref={inputRef}
      placeholder=""
      data-testid={computedTestId}
      {...inputProps}
    />
  );
}
