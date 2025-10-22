'use client';

import React, { useState } from 'react';
import { InputProps } from '@/types/ui';
import { useFieldState } from '@/lib/formUtils';
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

    const currentLength = typeof value === 'string' ? value.length : 0;
    const inputType = showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    const styleProps = {
      error,
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
            onChange={onChange}
            className={className}
            {...props}
          />

          {/* Password Toggle Button */}
          {showPasswordToggle && fieldState.isFocused && (
            <PasswordToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              inputRef={ref as React.RefObject<HTMLInputElement>}
            />
          )}

          {/* Character Counter */}
          {showCharCount && maxLength && fieldState.isFocused && (
            <CharCounter currentLength={currentLength} maxLength={maxLength} />
          )}

          {label && (
            <InputLabel
              {...styleProps}
              label={label}
              onClick={handleLabelClick}
            />
          )}
        </div>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
