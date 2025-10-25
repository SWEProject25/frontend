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
  handleSocialAuth,
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
        onSocialLogin={handleSocialAuth}
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
        {/* Success message for forgot-password (backend response) */}
        {errors && errors.forgotPasswordSuccess && (
          <div className="text-center">
            <p className="text-sm text-success">
              {errors.forgotPasswordSuccess}
            </p>
          </div>
        )}

        {(() => {
          // Find the first general error (not field-specific)
          const generalErrorKeys = [
            'login',
            'signup',
            'forgotPassword',
            'social',
            'otp',
            'resetPassword',
          ];
          const generalError = generalErrorKeys.find((key) => errors[key]);

          if (!generalError) return null;

          return (
            <div className="text-center">
              <p className="text-sm text-error">{errors[generalError]}</p>
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
