'use client';

import { useState, useCallback } from 'react';
import { UseFieldStateProps } from '@/types/formUtils';

export function useFieldState<T extends HTMLElement = HTMLElement>({
  value = '',
  onFocus,
  onBlur,
}: UseFieldStateProps<T> = {}) {
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== '';
  const shouldFloatLabel = isFocused || hasValue;

  const handleFocus = useCallback(
    (e: React.FocusEvent<T>) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<T>) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  return {
    isFocused,
    hasValue,
    shouldFloatLabel,
    handleFocus,
    handleBlur,
  };
}
