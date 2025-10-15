'use client';

import React, { useState, useCallback } from 'react';
import { InputField } from '@/components/ui/input';
import { useEmailValidation } from '@/features/authentication/hooks';

interface EmailInputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    enableRealTimeValidation?: boolean;
    apiEndpoint?: string;
    messages?: {
      invalidFormat?: string;
      alreadyTaken?: string;
    };
  };
}

export function EmailInputField({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  validation,
}: EmailInputFieldProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handleValidationChange = useCallback(
    (isValid: boolean, error?: string) => {
      setLocalError(error || null);
    },
    []
  );

  const {
    isValidating,
    error: validationError,
    validateWithDebounce,
  } = useEmailValidation({
    onValidationChange: handleValidationChange,
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
  const error = localError || validationError;

  return (
    <div className="relative">
      <InputField
        label={label}
        type="email"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        placeholder={placeholder}
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
