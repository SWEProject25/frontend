'use client';

import React, { useState } from 'react';
import { InputProps } from '@/types/ui';
import { useFieldState } from '@/lib/formUtils';
import { InputBase } from './components/InputBase';
import { InputLabel } from './components/InputLabel';
import { PasswordToggle } from './components/PasswordToggle';
import { CharCounter } from './components/CharCounter';
// styling handled in InputBase

export const InputField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
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

    const fieldState = useFieldState<HTMLInputElement | HTMLTextAreaElement>({
      value: value,
    });

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      fieldState.handleFocus(e);
      if (type === 'textarea') {
        (onFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>)?.(
          e as React.FocusEvent<HTMLTextAreaElement>
        );
      } else {
        (onFocus as unknown as React.FocusEventHandler<HTMLInputElement>)?.(
          e as React.FocusEvent<HTMLInputElement>
        );
      }
    };

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      fieldState.handleBlur(e);
      if (type === 'textarea') {
        (onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>)?.(
          e as React.FocusEvent<HTMLTextAreaElement>
        );
      } else {
        (onBlur as unknown as React.FocusEventHandler<HTMLInputElement>)?.(
          e as React.FocusEvent<HTMLInputElement>
        );
      }
    };

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

    const providedTestId = (
      props as unknown as Record<string, string | undefined>
    )['data-testid'];
    const nameAttr = (props as unknown as Record<string, unknown>).name as
      | string
      | undefined;
    const slug = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
    const computedTestId =
      providedTestId ??
      (nameAttr
        ? `auth-input-${nameAttr}`
        : label
          ? `auth-input-${slug(label)}`
          : `auth-input-${inputType}`);

    const handleLabelClick = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    };

    const inputRefCast = ref as React.RefObject<
      HTMLInputElement | HTMLTextAreaElement
    >;

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
            inputRef={inputRefCast}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={
              onChange as unknown as React.ChangeEventHandler<
                HTMLInputElement | HTMLTextAreaElement
              >
            }
            className={className}
            data-testid={computedTestId}
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
