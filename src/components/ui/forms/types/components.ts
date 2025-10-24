// Multi-step Form Types
// Unified type for top-level auth modal kinds used across the codebase
export type AuthModalType =
  | 'login'
  | 'signup'
  | 'createAccount'
  | 'forgotPassword';

export interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'modal' | 'fullpage';
  onSocialLogin?: (providerId: string) => void;
  onSwitchModal?: (newType: AuthModalType) => void;
  onForgotPassword?: () => void;
  onSubmit: (data: Record<string, string>, step?: AllSteps) => Promise<boolean>;
  formState: {
    isLoading: boolean;
    success: boolean;
    errors: Record<string, string>;
  };
  onClearState?: () => void;
  type: AuthModalType;
}

// Step-level types for the multi-step forms
export type LoginStep = 'email' | 'password';
export type CreateAccountStep = 'register' | 'captcha' | 'otp' | 'password';
export type SingleStep = 'signup' | 'forgotPassword';

export type AllSteps = LoginStep | CreateAccountStep | SingleStep;
