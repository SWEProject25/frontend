import React from 'react';
import { FormHeader } from './FormHeader';
import { SocialLoginSection } from './SocialLoginSection';
import { FormFields } from './FormFields';
import { FormActions } from './FormActions';
import { FormFooter } from './FormFooter';
import { FormContentProps } from '../types';

export function FormContent({
  title,
  subtitle,
  fields,
  submitButton,
  socialProviders = [],
  showDivider = true,
  showForgotPassword = false,
  footerLinks = [],
  loading,
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur,
  handleSubmit,
  handleSocialLogin,
  onForgotPassword,
  onSwitchModal,
  onClearState,
  isFormValid,
  onEmailValidationChange,
}: FormContentProps) {
  return (
    <>
      <FormHeader title={title} subtitle={subtitle} />

      <SocialLoginSection
        socialProviders={socialProviders}
        showDivider={showDivider}
        loading={loading}
        onSocialLogin={handleSocialLogin}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormFields
          fields={fields}
          formData={formData}
          errors={errors}
          touched={touched}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          onClearState={onClearState}
          onEmailValidationChange={onEmailValidationChange}
        />

        <FormActions
          submitButton={submitButton}
          loading={loading}
          showForgotPassword={showForgotPassword}
          onForgotPassword={onForgotPassword}
          isFormValid={isFormValid}
        />
      </form>

      <FormFooter footerLinks={footerLinks} onSwitchModal={onSwitchModal} />
    </>
  );
}
