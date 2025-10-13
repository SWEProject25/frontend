'use client';

import React from 'react';
import { FormContainer } from './components/FormContainer';
import { useGenericAuthForm } from './hooks/useGenericAuthForm';
import { GenericAuthFormProps } from './types';

export function GenericAuthForm(props: GenericAuthFormProps) {
  const {
    formData,
    errors,
    touched,
    displayMode,
    mounted,
    isRegisterForm,
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleSocialLogin,
  } = useGenericAuthForm(props);

  // Don't render until mounted in responsive mode to avoid hydration mismatch
  if (props.mode === 'responsive' && !mounted) {
    return null;
  }

  return (
    <FormContainer
      {...props}
      formData={formData}
      errors={errors}
      touched={touched}
      displayMode={displayMode as 'modal' | 'fullpage'}
      isRegisterForm={isRegisterForm}
      handleInputChange={handleInputChange}
      handleBlur={handleBlur}
      handleSubmit={handleSubmit}
      handleSocialLogin={handleSocialLogin}
    />
  );
}

// Re-export types and configs for backward compatibility
export type { GenericAuthFormProps, FormField, SocialProvider } from './types';
export { authFormConfigs } from './configs/authFormConfigs';
