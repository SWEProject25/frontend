'use client';

import React from 'react';
import { AuthLayout } from './AuthLayout';
import { AuthForm } from './AuthForm';
import { WelcomeContent } from './WelcomeContent';
import { useAuthModals, useAuthHandlers } from '../hooks';

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
  } = useAuthHandlers();

  // Show full-screen form on mobile
  if (showFullScreenForm) {
    return (
      <AuthForm
        type={showFullScreenForm}
        isOpen={true}
        onClose={closeFullScreenForm}
        onSwitchModal={switchModal}
        mode="fullpage"
        formState={formState}
        handleSocialLogin={handleSocialLogin}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleForgotPassword={handleForgotPassword}
        clearFormState={clearFormState}
      />
    );
  }

  return (
    <>
      <AuthLayout>
        <WelcomeContent
          onCreateAccount={() => openModal('createAccount')}
          onLogin={() => openModal('login')}
        />
      </AuthLayout>

      {/* Desktop Modals */}
      <AuthForm
        type="login"
        isOpen={modalType === 'login'}
        onClose={closeModal}
        onSwitchModal={switchModal}
        mode="modal"
        formState={formState}
        handleSocialLogin={handleSocialLogin}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleForgotPassword={handleForgotPassword}
        clearFormState={clearFormState}
      />
      <AuthForm
        type="signup"
        isOpen={modalType === 'signup'}
        onClose={closeModal}
        onSwitchModal={switchModal}
        mode="modal"
        formState={formState}
        handleSocialLogin={handleSocialLogin}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleForgotPassword={handleForgotPassword}
        clearFormState={clearFormState}
      />
      <AuthForm
        type="createAccount"
        isOpen={modalType === 'createAccount'}
        onClose={closeModal}
        onSwitchModal={switchModal}
        mode="modal"
        formState={formState}
        handleSocialLogin={handleSocialLogin}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        handleForgotPassword={handleForgotPassword}
        clearFormState={clearFormState}
      />
    </>
  );
}
