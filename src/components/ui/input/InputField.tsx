'use client';

import React, { useState, useCallback } from 'react';
import { InputProps } from '@/types/ui';
import { useFieldState } from '@/lib/formUtils';
import { useValidation } from '@/hooks/useValidation';
import { InputBase } from './components/InputBase';
import { InputLabel } from './components/InputLabel';
import { PasswordToggle } from './components/PasswordToggle';
import { CharCounter } from './components/CharCounter';

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      icon,
      value,
      showPasswordToggle = false,
      maxLength,
      showCharCount = false,
      onFocus,
      onBlur,
      onChange,
      validationRules,
      onValidationChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const fieldState = useFieldState<HTMLInputElement>({
      value: value,
      onFocus,
      onBlur,
    });

    // Use validation hook if rules are provided
    const validation = useValidation({
      rules: validationRules || [],
      onValidationChange,
    });

    // Handle input change with validation
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Call original onChange
        onChange?.(e);

        // Trigger validation if rules exist
        if (validationRules && validationRules.length > 0) {
          validation.validateWithDebounce(newValue);
        }
      },
      [onChange, validationRules, validation]
    );

    const currentLength = typeof value === 'string' ? value.length : 0;
    const inputType = showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    const styleProps = {
      error: error || validation.error,
      isFocused: fieldState.isFocused,
      hasValue: fieldState.hasValue,
      shouldFloatLabel: fieldState.shouldFloatLabel,
      icon,
      showPasswordToggle,
      showCharCount,
    };

    const handleLabelClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    return (
      <div className="relative">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <div className="text-text-inactive">{icon}</div>
            </div>
          )}

          <InputBase
            styleProps={styleProps}
            type={inputType}
            value={value}
            maxLength={maxLength}
            inputRef={ref}
            onFocus={fieldState.handleFocus}
            onBlur={fieldState.handleBlur}
            onChange={handleInputChange}
            className={className}
            {...props}
          />

          {/* Loading spinner for validation */}
          {validation.isValidating && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Password Toggle Button - Only show when focused and not validating */}
          {showPasswordToggle &&
            fieldState.isFocused &&
            !validation.isValidating && (
              <PasswordToggle
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                inputRef={ref as React.RefObject<HTMLInputElement>}
              />
            )}

          {/* Character Counter - Only show when focused and not validating */}
          {showCharCount &&
            maxLength &&
            fieldState.isFocused &&
            !validation.isValidating && (
              <CharCounter
                currentLength={currentLength}
                maxLength={maxLength}
              />
            )}

          {label && (
            <InputLabel
              {...styleProps}
              label={label}
              onClick={handleLabelClick}
            />
          )}
        </div>
        {(error || validation.error) && (
          <p className="mt-2 text-sm text-error">{error || validation.error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
