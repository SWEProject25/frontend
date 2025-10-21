// Multi-step Form Types
export interface MultiStepFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'modal' | 'fullpage';
  onSocialLogin?: (providerId: string) => void;
  onSwitchModal?: (newType: 'login' | 'signup' | 'createAccount') => void;
  onForgotPassword?: () => void;
  onSubmit: (data: Record<string, string>, step?: AllSteps) => Promise<boolean>;
  formState: {
    isLoading: boolean;
    success: boolean;
    errors: Record<string, string>;
  };
  onClearState?: () => void;
  type: 'login' | 'createAccount' | 'signup' | 'forgotPassword';
}

export type LoginStep = 'email' | 'password';
export type CreateAccountStep = 'register' | 'captcha' | 'otp' | 'password';
export type SingleStep = 'signup' | 'forgotPassword';
export type AllSteps = LoginStep | CreateAccountStep | SingleStep;

// Captcha Component Types
export interface CaptchaComponentProps {
  onVerify: (isValid: boolean, token?: string) => void;
}

// Password Strength Indicator Types
export interface PasswordStrengthIndicatorProps {
  password: string;
}
