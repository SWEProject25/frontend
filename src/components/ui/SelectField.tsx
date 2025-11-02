'use client';

import React from 'react';
import { cn, getSelectFieldWidthClass } from '@/lib/utils';
import { SelectProps } from '@/types/ui';
import { ChevronDownIcon } from './icons';
import {
  useFieldState,
  getFieldBaseStyles,
  getLabelStyles,
  getInputPadding,
} from '@/lib/formUtils';

export const SelectField = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      wrapperClassName,
      options,
      value,
      fullWidth = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const fieldState = useFieldState<HTMLSelectElement>({
      value: value,
      onFocus,
      onBlur,
    });

    // Calculate width class using utility function
    const widthClass = React.useMemo(() => {
      return getSelectFieldWidthClass(options, label, fullWidth);
    }, [options, label, fullWidth]);

    const styleProps = {
      isFocused: fieldState.isFocused,
      hasValue: fieldState.hasValue,
      shouldFloatLabel: fieldState.shouldFloatLabel,
    };

    // Compute deterministic data-testid: prefer explicit prop, then name, then label
    const providedTestId = (
      props as unknown as Record<string, string | undefined>
    )['data-testid'];
    const nameAttr = props.name as string | undefined;
    const slug = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '');
    const computedTestId =
      providedTestId ??
      (nameAttr
        ? `auth-select-${nameAttr}`
        : label
          ? `auth-select-${slug(label)}`
          : undefined);

    const handleLabelClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const selectEl = e.currentTarget.parentElement?.querySelector('select');
      if (selectEl) {
        selectEl.focus();
      }
    };

    return (
      <div
        className={cn(
          'relative',
          fullWidth ? 'block' : 'inline-block',
          wrapperClassName
        )}
      >
        <select
          value={value}
          className={cn(
            'peer h-16 px-4 text-lg text-foreground bg-transparent border rounded-lg transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer',
            widthClass,
            getInputPadding(fieldState.shouldFloatLabel),
            getFieldBaseStyles(styleProps),
            !fieldState.hasValue && 'text-text-placeholder',
            className
          )}
          onFocus={fieldState.handleFocus}
          onBlur={fieldState.handleBlur}
          ref={ref}
          data-testid={computedTestId}
          {...props}
        >
          <option value="" disabled hidden>
            {label || 'Select an option'}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-background text-foreground hover:bg-primary-hover"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-text-inactive " />
        </div>

        {/* Floating Label - matches InputField behavior */}
        {label && (
          <label
            className={cn(getLabelStyles(styleProps), 'cursor-text')}
            onClick={handleLabelClick}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
