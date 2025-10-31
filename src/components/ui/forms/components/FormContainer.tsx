'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { XLogo, CloseIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { FormContent } from './FormContent';
import { GenericAuthFormProps } from '../types';
import {
  handleOverlayClick,
  handleModalKeyDown,
  isFormValid,
  validatePasswordMatch,
} from '../utils';
import {
  validateName,
  validatePassword as validatePwd,
} from '@/features/authentication/utils/validators';

export function FormContainer(
  props: GenericAuthFormProps & {
    formState?: {
      isLoading: boolean;
      success: boolean;
      errors?: Record<string, string>;
    };
    onClearState?: () => void;
  }
) {
  const {
    fields,
    onSubmit,
    onSocialLogin,
    mode = 'modal',
    onClose,
    initialValues = {},
    className,
    formState,
  } = props;

  // Simple form state management
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [emailValidationState, setEmailValidationState] = useState<{
    isValid: boolean;
    isValidating: boolean;
  }>({ isValid: true, isValidating: false });

  // Password validation errors
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  // Field-level validation errors for realtime checks (name, password composition, username)
  const [fieldValidationErrors, setFieldValidationErrors] = useState<
    Record<string, string>
  >({});

  // Check if form has password fields
  const hasPasswordFields = useMemo(
    () =>
      fields.some((field) => field.name === 'password') &&
      fields.some((field) => field.name === 'confirmPassword'),
    [fields]
  );

  // Validate password match whenever password fields change
  useEffect(() => {
    if (hasPasswordFields) {
      const password = formData.password || '';
      const confirmPassword = formData.confirmPassword || '';

      // Only validate if both fields have been touched and both have values
      // If both fields are empty, clear errors
      if (!password && !confirmPassword) {
        setPasswordErrors({});
        return;
      }
      const error = validatePasswordMatch(password, confirmPassword);
      if (error) {
        // Show error color on both fields, but only display message under confirmPassword
        setPasswordErrors({
          password: ' ', // triggers error style only
          confirmPassword: error, // triggers error style and message
        });
      } else {
        // Clear errors when passwords match
        setPasswordErrors({});
      }
    } else if (!touched.password || !touched.confirmPassword) {
      // Clear errors if either field hasn't been touched yet
      setPasswordErrors({});
    }
  }, [
    formData.password,
    formData.confirmPassword,
    touched.password,
    touched.confirmPassword,
    hasPasswordFields,
  ]);

  // Merge password errors with form state errors and field-level validation errors
  const allErrors = useMemo(
    () => ({
      ...formState?.errors,
      ...passwordErrors,
      ...fieldValidationErrors,
    }),
    [formState?.errors, passwordErrors, fieldValidationErrors]
  );

  // Calculate form validity - check form state errors AND email validation AND password validation
  const isFormValidState = useMemo(() => {
    const formValid = isFormValid(fields, formData, allErrors);
    // Form is only valid if both form validation AND email validation pass AND no password errors
    return (
      formValid &&
      emailValidationState.isValid &&
      !emailValidationState.isValidating &&
      Object.keys(passwordErrors).length === 0
    );
  }, [fields, formData, allErrors, emailValidationState, passwordErrors]);

  // Update formData when initialValues change (but not during loading to preserve user input)
  useEffect(() => {
    // Don't reset form data while loading to preserve values like password
    if (formState?.isLoading) return;

    setFormData((prev) => {
      const init = initialValues || {};
      const initKeys = Object.keys(init);
      if (initKeys.length === 0) return prev;

      // Merge initialValues with existing formData to preserve user input
      // Only update fields that are in initialValues
      const hasChanges = initKeys.some((k) => prev[k] !== init[k]);
      if (!hasChanges) return prev;

      return { ...prev, ...init };
    });
  }, [initialValues, formState?.isLoading]);

  // Event handlers
  const handleInputChange = useCallback(
    (fieldName: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [fieldName]: value }));

        // Realtime validation for name field
        if (fieldName === 'name' || fieldName === 'fullName') {
          // mark touched so errors show immediately
          setTouched((prev) => ({ ...prev, [fieldName]: true }));
          const err = validateName(value);
          setFieldValidationErrors((prev) => {
            const next = { ...prev };
            if (err) next[fieldName] = err;
            else delete next[fieldName];
            return next;
          });
        }

        // Realtime password composition check (while typing)
        if (fieldName === 'password') {
          // mark touched so composition errors show immediately
          setTouched((prev) => ({ ...prev, password: true }));
          const pwdErr = validatePwd(value);
          setFieldValidationErrors((prev) => {
            const next = { ...prev };
            if (pwdErr) next.password = pwdErr;
            else delete next.password;
            return next;
          });
        }

        // Mark confirmPassword as touched when typing so match errors show realtime
        if (fieldName === 'confirmPassword') {
          setTouched((prev) => ({ ...prev, confirmPassword: true }));
        }
      },
    []
  );

  const handleBlur = useCallback(
    (fieldName: string) => () => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const handleSocialAuth = useCallback(
    (providerId: string) => {
      onSocialLogin?.(providerId);
    },
    [onSocialLogin]
  );

  const handleEmailValidationChange = useCallback(
    (isValid: boolean, isValidating: boolean) => {
      setEmailValidationState({ isValid, isValidating });
    },
    []
  );

  const displayMode = mode === 'responsive' ? 'modal' : mode;

  if (displayMode === 'fullpage') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-center mb-8">
            <XLogo />
          </div>
          <div className="bg-background rounded-2xl w-full">
            <div className="px-4 sm:px-8 pb-8">
              <FormContent
                {...props}
                formData={formData}
                errors={allErrors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                handleSocialAuth={handleSocialAuth}
                loading={formState?.isLoading || false}
                isFormValid={isFormValidState}
                onEmailValidationChange={handleEmailValidationChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50 bg-modal-overlay',
        className
      )}
      onClick={(e) => onClose && handleOverlayClick(e, onClose)}
      onKeyDown={(e) => onClose && handleModalKeyDown(e, onClose)}
      tabIndex={-1}
    >
      <div
        className="bg-background rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative shadow-2xl mx-4 sm:mx-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            className="absolute top-4 left-4 text-foreground hover:bg-gray-800 rounded-full p-2 transition-colors z-10"
            onClick={onClose}
            title="Close"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}

        {/* X Logo */}
        <div className="flex justify-center pt-8 pb-6">
          <XLogo className="w-10 h-10" />
        </div>

        {/* Content */}
        <div className="px-6 sm:px-8 pb-8">
          <FormContent
            {...props}
            formData={formData}
            errors={allErrors}
            touched={touched}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            handleSocialAuth={handleSocialAuth}
            loading={formState?.isLoading || false}
            isFormValid={isFormValidState}
            onEmailValidationChange={handleEmailValidationChange}
          />
        </div>
      </div>
    </div>
  );
}
