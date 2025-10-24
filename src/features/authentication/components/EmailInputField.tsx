'use client';

import React, { useCallback } from 'react';
import { InputField } from '@/components/ui/input';
import { useEmailValidation } from '@/features/authentication/hooks';
import { EmailInputFieldProps } from '../types';

export function EmailInputField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  validation,
  onValidationChange,
}: EmailInputFieldProps) {
  const {
    isValidating,
    error: validationError,
    validateWithDebounce,
  } = useEmailValidation({
    onValidationChange: (isValid) => {
      // Report validation state to parent form for submit button control
      onValidationChange?.(isValid, isValidating);
    },
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);

      // Trigger real-time validation if enabled
      if (validation?.enableRealTimeValidation && e.target.value) {
        validateWithDebounce(e.target.value);
      }
    },
    [onChange, validation?.enableRealTimeValidation, validateWithDebounce]
  );

  const handleBlur = useCallback(() => {
    onBlur();

    // Trigger validation on blur if enabled
    if (validation?.enableRealTimeValidation && value) {
      validateWithDebounce(value);
    }
  }, [
    onBlur,
    validation?.enableRealTimeValidation,
    value,
    validateWithDebounce,
  ]);

  // Determine the error to show
  const error = validationError;

  return (
    <div className="relative">
      <InputField
        label={label}
        type="email"
        name="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        placeholder={placeholder}
        data-testid="auth-email-input"
        required={required}
        disabled={disabled}
      />

      {/* Loading indicator for validation */}
      {isValidating && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
