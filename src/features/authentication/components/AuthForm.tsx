'use client';

import { FormContainer, authFormConfigs } from '@/components/ui/forms';
import { CloseXIcon, XLogoIcon } from '@/components/ui/icons';
import { AuthFormProps } from '../types';

export function AuthForm({
  type,
  isOpen,
  onClose,
  onSwitchModal,
  mode,
  formState,
  handleSocialLogin,
  handleLogin,
  handleSignup,
  handleForgotPassword,
  clearFormState,
}: AuthFormProps) {
  const handleCreateAccount = () => {
    // Switch to createAccount modal when Create account is clicked
    if (onSwitchModal) {
      onSwitchModal('createAccount');
    }
  };

  if (!isOpen) return null;

  const config =
    type === 'login'
      ? authFormConfigs.login
      : type === 'signup'
        ? authFormConfigs.signup
        : authFormConfigs.register;
  const onSubmit =
    type === 'login'
      ? handleLogin
      : type === 'signup'
        ? handleCreateAccount
        : handleSignup;

  // Mobile header for fullpage mode
  const mobileHeader = mode === 'fullpage' && (
    <div className="flex items-center justify-between p-4">
      <button
        onClick={onClose}
        className="text-foreground hover:bg-gray-800 rounded-full p-2 transition-colors"
      >
        <CloseXIcon className="w-5 h-5" />
      </button>
      <div className="flex justify-center flex-1">
        <XLogoIcon className="w-8 h-8 text-foreground" />
      </div>
      <div className="w-9"></div> {/* Spacer for centering */}
    </div>
  );

  // Full-screen wrapper for fullpage mode
  const fullScreenWrapper = mode === 'fullpage' && (
    <div className="min-h-screen bg-background">
      {mobileHeader}
      <div className="px-6">
        <FormContainer
          {...config}
          onSubmit={onSubmit}
          onSocialLogin={handleSocialLogin}
          onForgotPassword={handleForgotPassword}
          mode="fullpage"
          onClose={onClose}
          onSwitchModal={onSwitchModal}
          loading={formState.isLoading}
          error={formState.error}
          success={formState.success}
          onClearState={clearFormState}
        />
      </div>
    </div>
  );

  // Modal mode (no wrapper)
  const modalForm = mode === 'modal' && (
    <FormContainer
      {...config}
      onSubmit={onSubmit}
      onSocialLogin={handleSocialLogin}
      onForgotPassword={handleForgotPassword}
      mode="modal"
      onClose={onClose}
      onSwitchModal={onSwitchModal}
      loading={formState.isLoading}
      error={formState.error}
      success={formState.success}
      onClearState={clearFormState}
    />
  );

  return fullScreenWrapper || modalForm;
}
