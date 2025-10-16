'use client';

import { MultiStepForm } from '@/components/ui/forms/components/MultiStepForm';
import { CloseXIcon, XLogoIcon } from '@/components/ui/icons';
import { AuthFormProps } from '../types/hooks';
import { handleFormClose, getSubmitHandler } from '../utils';

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
  clearFieldError,
}: AuthFormProps) {
  if (!isOpen) return null;

  const handleClose = () => handleFormClose(clearFormState, onClose);
  const onSubmit = getSubmitHandler(
    type,
    handleLogin,
    handleSignup,
    onSwitchModal
  );

  const formProps = {
    isOpen,
    onClose: handleClose,
    mode,
    onSocialLogin: handleSocialLogin,
    onSwitchModal,
    onForgotPassword: handleForgotPassword,
    onSubmit,
    formState,
    onClearState: () => clearFieldError('otp'),
    type: type === 'loginPassword' ? 'login' : type,
  };

  return (
    <>
      {/* Mobile header for fullpage mode */}
      {mode === 'fullpage' && (
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleClose}
            className="text-foreground hover:bg-gray-800 rounded-full p-2 transition-colors"
          >
            <CloseXIcon className="w-5 h-5" />
          </button>
          <div className="flex justify-center flex-1">
            <XLogoIcon className="w-8 h-8 text-foreground" />
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      )}

      {/* Form wrapper - fullpage vs modal */}
      {mode === 'fullpage' ? (
        <div className="min-h-screen bg-background">
          <div className="px-6">
            <MultiStepForm {...formProps} />
          </div>
        </div>
      ) : (
        <MultiStepForm {...formProps} />
      )}
    </>
  );
}
