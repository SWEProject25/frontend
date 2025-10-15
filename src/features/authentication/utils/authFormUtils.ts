/**
 * Utility functions for AuthForm component
 */

/**
 * Handles switching to createAccount modal
 */
export const handleCreateAccount = (
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void
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
  handleLogin: (data: Record<string, string>) => void,
  handleSignup: (data: Record<string, string>) => void,
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void
) => {
  if (type === 'login') {
    return handleLogin;
  }
  if (type === 'signup') {
    return () => handleCreateAccount(onSwitchModal);
  }
  return handleSignup;
};
