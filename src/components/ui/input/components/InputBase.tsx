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
  const providedTestId = (
    inputProps as unknown as Record<string, string | undefined>
  )['data-testid'];
  const nameAttr = (inputProps as Record<string, unknown>).name as
    | string
    | undefined;
  const computedTestId =
    providedTestId ?? (nameAttr ? `auth-input-${nameAttr}` : undefined);

  const isTextarea =
    (inputProps as Record<string, unknown>).type === 'textarea';

  if (isTextarea) {
    const textareaProps =
      inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <textarea
        className={cn(
          getFieldBaseStyles(styleProps),
          getInputPadding(styleProps.shouldFloatLabel || false),
          'min-h-[140px] resize-vertical',
          className
        )}
        onFocus={
          onFocus as unknown as React.FocusEventHandler<HTMLTextAreaElement>
        }
        onBlur={
          onBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>
        }
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        placeholder=""
        data-testid={computedTestId}
        rows={textareaProps.rows ?? 6}
        {...textareaProps}
      />
    );
  }

  return (
    <input
      className={cn(
        getFieldBaseStyles(styleProps),
        getInputPadding(styleProps.shouldFloatLabel || false),
        className
      )}
      onFocus={onFocus as unknown as React.FocusEventHandler<HTMLInputElement>}
      onBlur={onBlur as unknown as React.FocusEventHandler<HTMLInputElement>}
      ref={inputRef as React.RefObject<HTMLInputElement>}
      placeholder=""
      data-testid={computedTestId}
      {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );
}
