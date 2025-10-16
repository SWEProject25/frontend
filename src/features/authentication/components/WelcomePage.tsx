'use client';

import { AuthLayout } from './AuthLayout';
import { AuthForm } from './AuthForm';
import { WelcomeContent } from './WelcomeContent';
import { useAuthModals, useAuthHandlers, AuthModalType } from '../hooks';

export function WelcomePage() {
  const {
    modalType,
    showFullScreenForm,
    openModal,
    closeModal,
    closeFullScreenForm,
    switchModal,
  } = useAuthModals();

  const {
    formState,
    handleSocialLogin,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    clearFormState,
    clearFieldError,
  } = useAuthHandlers();

  // Determine the active form type and mode
  const activeFormType = showFullScreenForm || modalType;
  const isFormOpen = !!activeFormType;
  const formMode = showFullScreenForm ? 'fullpage' : 'modal';
  const formCloseHandler = showFullScreenForm
    ? closeFullScreenForm
    : closeModal;

  return (
    <>
      {/* Welcome Content - only show when no form is open */}
      {!isFormOpen && (
        <AuthLayout>
          <WelcomeContent
            onCreateAccount={() => openModal('createAccount')}
            onLogin={() => openModal('login')}
          />
        </AuthLayout>
      )}

      {/* Auth Form - show when any form is active */}
      {isFormOpen && (
        <AuthForm
          type={activeFormType as AuthModalType}
          isOpen={true}
          onClose={formCloseHandler}
          onSwitchModal={switchModal}
          mode={formMode}
          formState={formState}
          handleSocialLogin={handleSocialLogin}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          handleForgotPassword={handleForgotPassword}
          clearFormState={clearFormState}
          clearFieldError={clearFieldError}
        />
      )}
    </>
  );
}
