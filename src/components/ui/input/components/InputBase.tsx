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
      {...inputProps}
    />
  );
}
