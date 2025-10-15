import { AuthModalType } from '../hooks/useAuthModals';

// Form State Types
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Authentication Form Props (unified for both modal and fullpage modes)
export interface AuthFormProps {
  type: AuthModalType;
  isOpen: boolean;
  onClose: () => void;
  onSwitchModal?: (newType: AuthModalType) => void;
  mode: 'modal' | 'fullpage';
  formState: FormState;
  handleSocialLogin: (providerId: string) => void;
  handleLogin: (data: Record<string, string>) => void;
  handleSignup: (data: Record<string, string>) => void;
  handleForgotPassword: () => void;
  clearFormState: () => void;
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
