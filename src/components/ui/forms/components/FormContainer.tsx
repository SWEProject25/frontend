'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { XLogo, CloseIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { FormContent } from './FormContent';
import { GenericAuthFormProps } from '../types';
import { handleOverlayClick, handleModalKeyDown } from '../utils';

export function FormContainer(props: GenericAuthFormProps) {
  const {
    onSubmit,
    onSocialLogin,
    mode = 'modal',
    onClose,
    initialValues = {},
    className,
  } = props;

  // Simple form state management
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);
  const [errors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update formData when initialValues change
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  // Event handlers
  const handleInputChange = useCallback(
    (fieldName: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
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

  const handleSocialLogin = useCallback(
    (providerId: string) => {
      onSocialLogin?.(providerId);
    },
    [onSocialLogin]
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
                errors={errors}
                touched={touched}
                handleInputChange={handleInputChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                handleSocialLogin={handleSocialLogin}
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
        'fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-50',
        className
      )}
      style={{ backgroundColor: 'rgba(91, 112, 131, 0.4)' }}
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
            errors={errors}
            touched={touched}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            handleSubmit={handleSubmit}
            handleSocialLogin={handleSocialLogin}
          />
        </div>
      </div>
    </div>
  );
}
