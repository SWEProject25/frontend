import React from 'react';
import { cn } from '@/lib/utils';
import { getLabelStyles, FieldStyleProps } from '@/lib/formUtils';
import { InputLabelProps } from '../types';

export function InputLabel({
  label,
  onClick,
  error,
  isFocused,
  hasValue,
  shouldFloatLabel,
  icon,
  showPasswordToggle,
  showCharCount,
}: InputLabelProps) {
  const fieldStyleProps: FieldStyleProps = {
    error,
    isFocused,
    hasValue,
    shouldFloatLabel,
    icon,
    showPasswordToggle,
    showCharCount,
  };
  return (
    <label className={cn(getLabelStyles(fieldStyleProps))} onClick={onClick}>
      {label}
    </label>
  );
}
