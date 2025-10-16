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

        {/* General form errors */}
        {(() => {
          // Find the first general error (not field-specific)
          const generalErrorKeys = [
            'login',
            'signup',
            'forgotPassword',
            'social',
            'otp',
          ];
          const generalError = generalErrorKeys.find((key) => errors[key]);

          if (!generalError) return null;

          return (
            <div className="text-center">
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {errors[generalError]}
              </p>
            </div>
          );
        })()}

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
