/**
 * Utility functions for AuthForm component
 */

/**
 * Handles switching to createAccount modal
 */
import { AuthModalType } from '@/components/ui/forms/types/components';

export const handleCreateAccount = (
  onSwitchModal?: (newType: AuthModalType) => void
) => {
  if (onSwitchModal) {
    onSwitchModal('createAccount');
  }
};

/**
 * Handles closing the form with state cleanup
 */
export const handleFormClose = (
  clearFormState: () => void,
  onClose: () => void
) => {
  clearFormState();
  onClose();
};

/**
 * Determines the appropriate submit handler based on form type
 */
export const getSubmitHandler = (
  type: string,
  handleLogin: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>,
  handleSignup: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>,
  handleForgotPassword?: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>,
  onSwitchModal?: (newType: AuthModalType) => void
) => {
  if (type === 'login') {
    return handleLogin;
  }
  if (type === 'signup') {
    return async () => {
      handleCreateAccount(onSwitchModal);
      return true;
    };
  }
  if (type === 'forgotPassword' && handleForgotPassword) {
    return handleForgotPassword;
  }
  return handleSignup;
};
