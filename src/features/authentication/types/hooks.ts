import { AuthModalType } from '../hooks/useAuthModals';

// Form State Types
export interface FormState {
  isLoading: boolean;
  success: boolean;
  errors: Record<string, string>;
}

// Authentication Form Props (unified for both modal and fullpage modes)
export interface AuthFormProps {
  type: AuthModalType;
  isOpen: boolean;
  onClose: () => void;
  onSwitchModal?: (newType: AuthModalType) => void;
  mode: 'modal' | 'fullpage';
  formState: FormState;
  handleSocialAuth: (providerId: string) => void;
  handleLogin: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>;
  handleSignup: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>;
  handleForgotPassword: (
    data: Record<string, string>,
    step?: string
  ) => Promise<boolean>;
  clearFormState: (fieldName?: string) => void;
}

// Welcome Content Props
export interface WelcomeContentProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

// Authentication Layout Props
export interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

// Email Validation Hook Types
export interface EmailValidationState {
  isValidating: boolean;
  error: string | undefined;
  isValid: boolean;
}

export interface UseEmailValidationOptions {
  onValidationChange?: (isValid: boolean, error?: string) => void;
}
