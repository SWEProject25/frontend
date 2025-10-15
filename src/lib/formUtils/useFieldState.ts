'use client';

import { useState, useCallback } from 'react';

export interface UseFieldStateProps<T extends HTMLElement = HTMLElement> {
  value?: string;
  onFocus?: (e: React.FocusEvent<T>) => void;
  onBlur?: (e: React.FocusEvent<T>) => void;
}

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
