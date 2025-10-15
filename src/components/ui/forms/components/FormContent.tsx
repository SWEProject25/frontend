import React from 'react';
import { FormHeader } from './FormHeader';
import { SocialLoginSection } from './SocialLoginSection';
import { FormFields } from './FormFields';
import { FormActions } from './FormActions';
import { FormFooter } from './FormFooter';
import { GenericAuthFormProps, FormState, FormHandlers } from '../types';

interface FormContentProps
  extends GenericAuthFormProps,
    FormState,
    FormHandlers {
  isRegisterForm: boolean;
}

export function FormContent({
  title,
  subtitle,
  fields,
  submitButton,
  socialProviders = [],
  showDivider = true,
  showForgotPassword = false,
  footerLinks = [],
  loading = false,
  formData,
  errors,
  touched,
  handleInputChange,
  handleBlur,
  handleSubmit,
  handleSocialLogin,
  onForgotPassword,
  isRegisterForm,
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
          isRegisterForm={isRegisterForm}
        />

        <FormActions
          submitButton={submitButton}
          loading={loading}
          showForgotPassword={showForgotPassword}
          onForgotPassword={onForgotPassword}
        />
      </form>

      <FormFooter footerLinks={footerLinks} />
    </>
  );
}
